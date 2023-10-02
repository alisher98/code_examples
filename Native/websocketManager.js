import WebsocketConnection from "../websocket/websocket";
import {SOURCE_CONFIG} from "../axios";
import {removeTrailingSlash} from "../utils/urlUtils";
import {SourceManager} from "./sourceManager";
import {getCookie} from "../utils/cookieUtils"

export default class WebsocketManager {
    constructor(sourceManager) {
        this.connections = []
        this._sourceManager = sourceManager
    }

    connectToRoom(coid) {
        if (this.connections[coid] === undefined) {
            const room = {
                id: coid,
                type: 'object'
            }
            this.connections[coid] = new WebSocket(this._buildWebsocketUrl(coid))
            this.connections[coid].onopen = (event) => {

            }
            this.connections[coid].onmessage = (event) => {
                // console.log('onmessage', event)
                this._sourceManager.processData(event.data)
            }
        }
    }

    _buildWebsocketUrl(coid) {
        const baseUrl = SOURCE_CONFIG.baseURL || window.location.origin;
        return removeTrailingSlash(baseUrl).replace('http', 'ws')
            + '/o/esbd-websocket/simple-entity/' + coid;
    }

    close() {
        if (this.connections.length) {
            for (const c of this.connections) {
                if (c !== undefined) {
                    c.close()
                }
            }
        }
    }
}