import IndexedDBHandler from '../utils/indexedDBHandler';
import {
    ENDPOINTS_CONFIG,
    ENTITIES_CONFIG,
    LOADING_SESSION_STORAGE_KEY,
    STORAGE_CONFIG
} from '../const/config';
import {HTTP} from '../axios';
import WebsocketManager from "./websocketManager";
import delay from "../utils/timeUtils";

export class SourceManager {
    /**
     * Source Manager отвечает за выбор источника данных и их модификацию в IndexedDB.
     * Если данные в IndexedDB актуальны - он возьмёт данные из кэша,
     * иначе данные будут получены с сервера
     */
    constructor() {
        this._managerDBName = 'SourceManagerData';
        this._entitiesDataTableName = 'endpointsData';
        this._dbConfig = this._buildDBConfig(this.getStoreNameByLevel('object'));
        this._globalDBConfig = this._buildDBConfig(this.getStoreNameByLevel('global'));

        this._transactions = {}
        this._entityCountdbHandler = null
        this._websocketManager = new WebsocketManager(this);

        this._storageConfig = {object: [], global: [], service: []}
        for (const storage in STORAGE_CONFIG) {
            if (this._storageConfig[STORAGE_CONFIG[storage].level] !== undefined) {
                this._storageConfig[STORAGE_CONFIG[storage].level].push({
                    'name': storage,
                    'key': STORAGE_CONFIG[storage].key,
                    'autoIncrement': STORAGE_CONFIG[storage].autoIncrement,
                })
            }
        }

        this._aggregateStorages = []
        for (const s in ENTITIES_CONFIG) {
            if (ENTITIES_CONFIG[s].aggregate !== undefined && ENTITIES_CONFIG[s].aggregate) {
                this._aggregateStorages.push(ENTITIES_CONFIG[s].storeName)
            }
        }

        this.data = {}
        this._resetCashData()
        this._removeLoading()
        this.smi = []
        this.dublicate_smi = {}
    }

    _resetCashData() {
        this.data = {}
    }

    _getDBName(level, coid) {
        let n = Number(coid)
        let name = ''
        switch (level) {
            case 'global':
                name = 'global'
                break
            case 'service':
                name = 'service'
                break
            case 'object':
                n = (isNaN(n) || !n) ? 0 : n;
                name = 'object_' + n
        }
        return name;
    }

    async getEntityData(entityCode, storeName, endpoints, coid, force, isSingle) {
        if (STORAGE_CONFIG[storeName] !== undefined) {
            // Если метка активна, то
            // регулярно опрашивать состояние метки до тех пор, пока метка не будет снята

            if (entityCode !== 'shippingMarkInstanceStatusChange') {
                let loading = this._isLoading()
                while (loading) {
                    await delay(300).then(() => loading = this._isLoading());
                    console.log('loading')
                }
            }

            if (coid) {
                coid = parseInt(coid)
                await this._updateRoom(coid)
            } else {
                coid = 0
            }

            // избегаем повторного ненужного обращения к IndexedDB (оно может приводить к утечке памяти)
            if (!force && this.data[coid] !== undefined && this.data[coid][entityCode] !== undefined && this.data[coid][entityCode].length) {
                return [...this.data[coid][entityCode]];
            }

            const dbHandler = await this._getStoreDbHandler(storeName, coid)
            let data = await dbHandler.getAllDataFromTable(storeName);

            if (!force && data.length > 0) {
                force = !await this._checkEntityCount(entityCode, coid, data.length)
                console.log('checkEntityCount', !force, entityCode, coid)
            }

            let singleExists = isSingle && data.length > 0 && await dbHandler.getData(storeName, coid) !== undefined;
            let updatedEntries = [];
            if (force || data.length === 0 || (isSingle && !singleExists)) {
                // ставить метку о запуске получения данных с бэка
                this._setLoading()
                for (const i in endpoints) {
                    let entitiesData = await this._getEndpointData(endpoints[i], coid)
                    if (entitiesData.pagination !== undefined && entitiesData.pagination.isPagination !== undefined && entitiesData.pagination.isPagination) {
                        // сохранить totalCount с бэка для entityCode saveEntityCount()
                        await this._saveEntityCount(entityCode, entitiesData.pagination.totalCount, coid)
                        let pageCount = 5
                        let pageSize = Math.ceil(entitiesData.pagination.totalCount / pageCount)
                        if (pageSize > 5000) {
                            pageSize = 5000
                            pageCount = Math.ceil(entitiesData.pagination.totalCount / pageSize)
                        }
                        let chunks = [];
                        if (pageSize) {
                            for (let page = 0; page < pageCount; page++) {
                                await delay(1000).then(() => console.log('ran after 1000 milliseconds passed'));
                                chunks[page] = this._getEndpointData(endpoints[i], coid, page, pageSize).then((r) => {
                                    console.info('Сохранение в indexedDB', storeName, coid, page)
                                    return this._saveEntitiesData(r, dbHandler)
                                })
                            }
                        }
                        const chunkSaveResult = await Promise.all(chunks)
                        console.info('Сохранено в indexedDB', storeName, coid)
                        // сохранить totalCount из indexedDB для entityCode
                        updatedEntries = Array.isArray(chunkSaveResult) && chunkSaveResult.length
                            ? [...updatedEntries, ...chunkSaveResult[0]]
                            : updatedEntries
                        await this._updateEntityCount(entityCode, coid, await dbHandler.count(storeName))
                    } else {
                        if (entityCode === 'shippingMarkInstanceStatusChange') {
                            // console.log(entitiesData[entityCode])
                            this._removeLoading()
                            return [...entitiesData.entities[entityCode]]
                        } else {
                            console.info('Сохранение в indexedDB', storeName, coid)
                            const saveResult = await this._saveEntitiesData(entitiesData, dbHandler)
                            for (const checkEntityCode in entitiesData.entities) {
                                await this._saveEntityCount(checkEntityCode, entitiesData.entities[checkEntityCode].length, coid)
                                await this._updateEntityCount(checkEntityCode, coid, entitiesData.entities[checkEntityCode].length)
                            }
                            console.info('Сохранено в indexedDB', storeName, coid)
                            updatedEntries = saveResult ? [...updatedEntries, ...saveResult] : updatedEntries
                        }
                    }
                    const entitiesLoad = {}
                    entitiesLoad[entityCode] = Date.now()
                    await this._updateRoom(coid, 'object', {entitiesLoad})
                }
                this._removeLoading()
                console.warn('Дубликаты эОМ', this.dublicate_smi, Object.values(this.dublicate_smi).length)
            }

            // очищаем те закешированные данные, которые обновились
            // на неуникальность updatedEntries закрываем глаза
            if (this.data[coid] !== undefined) {
                for (const e in updatedEntries) {
                    this.data[coid][e] = []
                }
            }

            if (isSingle) {
                data = await dbHandler.getData(storeName, coid)
                return data ? {...data} : {}
            } else {
                if (entityCode === 'unallocatedBatch') {
                    const globalDbHandler = await this._getDbHandler('object', coid)
                    const batchResult = await globalDbHandler.getAllDataFromTable('batch')
                    data = batchResult.filter(i => i.unallocated)
                } else {
                    data = updatedEntries.length ? await dbHandler.getAllDataFromTable(storeName) : data
                    // if (entityCode === 'batch' && coid && data.length > 0) {
                    //     data = data.filter(i => parseInt(i.coid, 10) === coid)
                    // }
                }
            }
            if (this.data[coid] === undefined) {
                this.data[coid] = {}
            }
            this.data[coid][entityCode] = data
            return data ? [...data] : []
        } else {
            return new Promise((resolve, reject) => {
                reject('Хранилище не найдено')
            })
        }
    }

    async saveData(entityData, entityCode, storeName, coid) {
        if (STORAGE_CONFIG[storeName] !== undefined) {
            const storeConfig = STORAGE_CONFIG[storeName]
            const {level} = storeConfig
            const dbName = this._getDBName(level, coid)
            const dbHandler = new IndexedDBHandler(dbName, this._storageConfig[level])
            await dbHandler.connectToDatabase()
            let data = {entities: {}}
            data.entities[entityCode] = entityData
            // console.log(data)
            await this._saveEntitiesData(data, dbHandler)
            return true
        } else {
            return new Promise((resolve, reject) => {
                reject('Хранилище не найдено')
            })
        }
    }

    async cleanData(coid, entityCodes) {
        this._resetCashData()
        const countDbHandler = await this._getEntityCountdbHandler()
        for (const i in entityCodes) {
            const storeName = ENTITIES_CONFIG[entityCodes[i]].storeName
            const storeConfig = STORAGE_CONFIG[storeName]
            const {level} = storeConfig
            const dbName = this._getDBName(level, coid)
            const dbHandler = new IndexedDBHandler(dbName, this._storageConfig[level])
            await dbHandler.connectToDatabase()
            await dbHandler.deleteAllDataFromTable(storeName)

            countDbHandler.deleteData('entityCount', this._getEntityCountRecId(entityCodes[i], coid))
        }
    }

    async cleanAllData() {
        this._websocketManager.close()
        this._resetCashData()
        const dbServiceHandler = await this._getDbHandler('service')
        const rooms = await dbServiceHandler.getAllDataFromTable('room')
        if (rooms && Array.isArray(rooms)) {
            for (const room of rooms) {
                await indexedDB.deleteDatabase(this._getDBName('object', room.id))
            }
        }
        await indexedDB.deleteDatabase('global')
        for (const i of ['room', 'message', 'entityCount']) {
            await dbServiceHandler.deleteAllDataFromTable(i)
        }
    }

    async cleanObjectData(coid) {
        this._resetCashData()
        indexedDB.deleteDatabase(this._getDBName('object', coid))
    }

    async getAllData(coid, entityCodes) {

    }

    async _getEndpointData(endpointCode, coid, page = 0, pageSize = 1) {
        let endpointData = {};
        if (ENDPOINTS_CONFIG[endpointCode] !== undefined) {
            const endpoint = ENDPOINTS_CONFIG[endpointCode]
            endpointData = await this._requestBackend(endpoint, coid, page, pageSize)
        } else {
            return new Promise((resolve, reject) => {
                reject('Endpoint не найден')
            })
        }
        return endpointData
    }

    async _requestBackend(endpoint, coid, page, pageSize) {
        let endpointData = {}
        const url = endpoint.url.replace('$coid', coid).replace('$pageSize', pageSize).replace('$page', page);
        try {
            console.log('Запрос ' + url)
            let response = await HTTP.get(url);
            if (response.status === 200) {
                endpointData = endpoint.distribute(response.data, coid);
                if (endpointData.pagination === undefined) {
                    endpointData.pagination = {isPagination: false}
                }
                endpointData.pagination.isPagination = endpoint.url.indexOf('$page') !== -1
            }
        } catch (e) {
            console.log(e)
        }
        return endpointData
    }

    async _saveEntitiesData(data, dbHandler) {
        // console.info('Сохранение сущностей')
        if (data.entities === undefined) {
            return false
        }
        for (const entityCode in data.entities) {
            const {storeName} = ENTITIES_CONFIG[entityCode]
            const {key} = STORAGE_CONFIG[storeName]
            console.info('Сохранение ' + entityCode)
            if (data.method !== undefined && data.method[entityCode] === 'patch') {
                console.info('Сохранение данных ' + entityCode)
                await dbHandler.patchListData(storeName, data.entities[entityCode], key)
            } else {
                console.info('Обновление данных ' + entityCode)
                await dbHandler.addListData(storeName, data.entities[entityCode])
                // if (storeName === 'simpleShippingMarkInstance') {
                //     // console.log(d.id)
                //     if (this.smi.includes(d.id)) {
                //         // console.warn('smi уже содержит', d.id)
                //         if (this.dublicate_smi[d.id] === undefined) {
                //             this.dublicate_smi[d.id] = 1
                //         } else {
                //             this.dublicate_smi[d.id] += 1
                //         }
                //     } else {
                //         this.smi.push(d.id)
                //     }
                // }
            }
        }
        return Object.keys(data.entities)
    }


    getStoreNameByLevel(type) {
        return Object.entries(STORAGE_CONFIG)
            .filter(i => {
                return i[1].type === type;
            }).map(([k, v]) => {
                return {name: k, ...v};
            });
    }

    async wsConnect() {
        const dbHandler = await this._getDbHandler('service')
        const data = await dbHandler.getAllDataFromTable('room')
        if (data) {
            for (const i of data) {
                this._websocketManager.connectToRoom(i.id)
            }
        }
        // this._websocketManager.connectToRoom(1974033)
        // this._websocketManager.connectToRoom(3437413)
    }

    async processData(message) {
        try {
            const data = JSON.parse(message)
            if (data.modeType !== undefined) {
                switch (data.modeType) {
                    case 'regular':
                        await this.applyData(data)
                        console.warn("Зафиксировано изменение данных")
                        this.setStorageDataChanged(data.room.id)
                        break
                    case 'connection':
                        await this.processDelta(data)
                        break
                    case 'overload':
                        console.warn("Зафиксирован overload")
                        localStorage.setItem('overload', "1");
                }
            } else if (data.messages !== undefined && Array.isArray(data.messages) && data.messages.length) {
                for (let m of data.messages) {
                    await this.processData(JSON.stringify(m))
                }
            }
        } catch (e) {
            console.warn(e)
        }
    }

    setStorageDataChanged(room_id) {
        room_id += ''
        const room_list = localStorage.getItem('storage_data_changed')
        if (room_list) {
            let room_ids = room_list.split(',')
            console.log(room_ids, room_ids.includes(room_id))
            if (!room_ids.includes(room_id)) {
                room_ids.push(room_id)
                localStorage.setItem('storage_data_changed', room_ids.join(','));
            }
        } else {
            localStorage.setItem('storage_data_changed', room_id);
        }
    }

    async deleteAggregates(room_ids) {
        for (let coid of room_ids) {
            const dbHandler = await this._getDbHandler('object', coid)
            for (const s of this._aggregateStorages) {
                console.info("Очищаем агрегат " + s + " для объекта " + coid)
                await dbHandler.deleteAllDataFromTable(s)
            }
        }
    }

    async processDelta(data) {
        if (data !== undefined && data.id !== undefined && data.room !== undefined) {
            if (data.room.roomType !== undefined && data.room.id !== undefined) {
                await this._fixLastMessageId(data)
                const dbHandler = await this._getDbHandler('service')
                let room = await dbHandler.getData('room', parseInt(data.room.id))
                if (room.lastConnectionId && room.currentConnectionId && room.lastConnectionId !== room.currentConnectionId) {
                    this._websocketManager.connections[data.room.id].send(JSON.stringify({
                        id: Date.now(),
                        from: room.lastConnectionId,
                        to: room.currentConnectionId,
                        room: data.room
                    }));
                }
            }
        }
    }

    async applyData(data) {
        let coid = 0
        if (data['room'] !== undefined && data['room']['id'] && data['room']['roomType']) {
            if (data['room']['roomType'] === 'object') {
                coid = parseInt(data['room']['id'])
            }
        }
        if (coid && data['event'] !== undefined && data['event']['messageType'] && data['event']['entityType'] && data.message !== undefined) {
            const entityCode = this._getEntityCodeByEntityType(data['event']['entityType'])
            const {storeName} = ENTITIES_CONFIG[entityCode]
            const entityDbHandler = await this._getStoreDbHandler(storeName, coid)
            const key = STORAGE_CONFIG[storeName]['key']
            const id = data.message[key]
            switch (data['event']['messageType']) {
                case 'update':
                    if (await entityDbHandler.count(storeName)) {
                        await entityDbHandler.updateOrCreateData(storeName, data.message)
                        await this._setEntityCountLastUpdatedTS(entityCode, coid)
                        this._resetCashData()
                        console.info(`Updated ${entityCode}[${id}]: `, data.message)
                    } else {
                        const endpoints = ENTITIES_CONFIG[entityCode]['endpoints']
                        await this.getEntityData(entityCode, storeName, endpoints, coid, true, false)
                        console.warn(`Нет данных ${entityCode} для обновления`)
                    }
                    break
                case 'create':
                    await entityDbHandler.updateOrCreateData(storeName, data.message)
                    await this._setEntityCountLastUpdatedTS(entityCode, coid)
                    this._resetCashData()
                    console.info(`Created ${entityCode}[${id}]: `, data.message)
                    break
                case 'delete':
                    await entityDbHandler.deleteData(storeName, id)
                    await this._setEntityCountLastUpdatedTS(entityCode, coid)
                    this._resetCashData()
                    console.info(`Deleted ${entityCode}[${id}]: `, data.message)
                    break
            }
        }

        await this._fixLastMessageId(data)
    }

    _getEntityCodeByEntityType(entityType) {
        let entityCode = ''
        switch (entityType) {
            case 'order':
            case 'detail':
                entityCode = entityType
                break
            case 'detail_instance':
                entityCode = 'detailInstance'
                break
            case 'shipping_mark':
                entityCode = 'simpleShippingMark'
                break
            case 'shipping_mark_instance':
                entityCode = 'simpleShippingMarkInstance'
                break
            case 'group':
                entityCode = 'constructionObject'
                break
            case 'persisted_assembly_batch':
                entityCode = 'batch'
                break
            case 'persisted_weld':
                entityCode = 'weld'
                break
            case 'persisted_hole':
                entityCode = 'hole'
                break
        }
        return entityCode
    }

    async _getEntityCountdbHandler() {
        if (this._entityCountdbHandler === null) {
            const storeName = 'entityCount'
            const storeConfig = STORAGE_CONFIG[storeName]
            const {level} = storeConfig
            const dbName = this._getDBName(level)
            const dbHandler = new IndexedDBHandler(dbName, this._storageConfig[level])
            await dbHandler.connectToDatabase()
            this._entityCountdbHandler = dbHandler
        }
        return this._entityCountdbHandler
    }

    async _getStoreDbHandler(storeName, coid) {
        const storeConfig = STORAGE_CONFIG[storeName]
        const {level} = storeConfig
        return this._getDbHandler(level, coid)
    }

    async _getDbHandler(level, coid) {
        const dbName = this._getDBName(level, coid)
        const dbHandler = new IndexedDBHandler(dbName, this._storageConfig[level])
        await dbHandler.connectToDatabase()
        return dbHandler
    }

    _getEntityCountRecId(entityCode, coid = 0) {
        return `${coid ? coid : 'global'}-${entityCode}`
    }

    async _saveEntityCount(entityCode, totalCount, coid = 0) {
        const countDbHandler = await this._getEntityCountdbHandler()
        await countDbHandler.updateOrCreateData('entityCount', {
            id: this._getEntityCountRecId(entityCode, coid),
            coid,
            entityCode,
            totalCount,
            check: null,
            getCountTS: Date.now(),
            checkTS: null,
            lastUpdatedTS: null
        })
    }

    async _updateEntityCount(entityCode, coid, count) {
        const id = this._getEntityCountRecId(entityCode, coid)
        const countDbHandler = await this._getEntityCountdbHandler()
        try {
            const data = await countDbHandler.getData('entityCount', id)
            await countDbHandler.patchData('entityCount', {
                id,
                check: data.totalCount !== undefined && data.totalCount === count,
                checkTS: Date.now()
            }, 'id')
            return true
        } catch (e) {
            console.log(e, entityCode, coid)
            return false
        }
    }

    async _checkEntityCount(entityCode, coid, dataLength) {
        const id = this._getEntityCountRecId(entityCode, coid)
        const countDbHandler = await this._getEntityCountdbHandler()
        try {
            const data = await countDbHandler.getData('entityCount', id)
            if (data !== undefined) {
                return data.totalCount === dataLength
            } else {
                return false
            }
        } catch (e) {
            console.log(e, entityCode, coid)
            return false
        }
    }

    async _setEntityCountLastUpdatedTS(entityCode, coid) {
        const id = this._getEntityCountRecId(entityCode, coid)
        const countDbHandler = await this._getEntityCountdbHandler()
        try {
            const data = await countDbHandler.getData('entityCount', id)
            await countDbHandler.patchData('entityCount', {
                id,
                lastUpdatedTS: Date.now()
            }, 'id')
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    _buildDBConfig(entitiesList) {
        const config = {tablesToCreate: []};
        for (const {name, keyValue, autoIncrement} of entitiesList) {
            config.tablesToCreate.push({
                name,
                keyPath: keyValue || 'id',
                autoIncrement,
            });
        }
        return config;
    }

    async _updateRoom(id, type, data) {
        if (type !== undefined) {
            type = 'object'
        }
        id = parseInt(id)
        if (id) {
            const dbHandler = await this._getDbHandler('service')
            let room = await dbHandler.getData('room', id)
            if (room === undefined) {
                room = {
                    id: id,
                    type: type,
                    lastConnectionId: null,
                    currentConnectionId: null,
                    delta: {},
                    deltaProcessed: false,
                    entitiesLoad: {}
                }
                await dbHandler.updateOrCreateData('room', room)
            }
            if (data !== undefined && data) {
                if (data.entitiesLoad !== undefined) {
                    for (const e in data.entitiesLoad) {
                        room.entitiesLoad[e] = data.entitiesLoad[e]
                    }
                    data.entitiesLoad = room.entitiesLoad
                }
                data.id = id
                await dbHandler.patchData('room', data, 'id')
            }
        }
    }

    _isLoading() {
        return sessionStorage.getItem(LOADING_SESSION_STORAGE_KEY) !== null
    }

    _setLoading() {
        console.info("Стартовала загрузка с бэка")
        return sessionStorage.setItem(LOADING_SESSION_STORAGE_KEY, '1')
    }

    _removeLoading() {
        console.info("Загрузка с бэка завершена")
        return sessionStorage.removeItem(LOADING_SESSION_STORAGE_KEY)
    }

    async _fixLastMessageId(data) {
        let room_id = data.room !== undefined && data.room.id !== undefined ? parseInt(data.room.id) : 0;
        let id = data.id !== undefined ? data.id : 0;

        if (room_id && id) {
            const dbHandler = await this._getDbHandler('service')
            let room = await dbHandler.getData('room', room_id)
            await this._updateRoom(room_id, 'object', {
                lastConnectionId: room.currentConnectionId,
                currentConnectionId: id,
                deltaProcessed: false
            })
        }
    }
}