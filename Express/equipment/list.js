const libApi = require('libs/api');
const libMysql = require('libs/mysql');
const sha1 = require('sha1');
const moduleModel = require("models/module");
const libPermission = require("libs/permissions");
const libValidator = require('libs/validator');
const config = require('config');
const i18n = require("libs/i18n");
const helper = require("libs/helper");
const to = require('await-to-js').default;
const knex = require('knex')({
    client: 'mysql'
});

/**
 * @api {get} /v1/equipment/list Get po list
 * @apiGroup PO
 * @apiVersion 0.0.6
 *
 * @apiError (Error 200) {Number} res Result flag, 0.
 * @apiError (Error 200) {String} error  Error text.
 */


var actionFunction = function (req, res, actionCallback) {


    i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
    let validator = new libValidator(i18n);

    let rules = [
        {name: "filter.productname", rule: "notEmptySetDefault", default: null},
        {name: "filter.model", rule: "notEmptySetDefault", default: null},
        {name: "filter.description", rule: "notEmptySetDefault", default: null},
        {name: "filter.serial", rule: "notEmptySetDefault", default: null},
        {name: "filter.eid", rule: "notEmptySetDefault", default: null},
        {name: "filter.calibrationf", rule: "notEmptySetDefault", default: null},
        {name: "filter.lastdate", rule: "notEmptySetDefault", default: null},
        {name: "filter.duedate", rule: "notEmptySetDefault", default: null},
        {name: "filter.calibration_status", rule: "notEmptySetDefault", default: null},
        {name: "filter.warehouse_name", rule: "notEmptySetDefault", default: null},
        {
            name: "page",
            rule: "notEmptySetDefault",
            default : 1
        },
        {
            name: "page",
            rule: "isInt",
            options: {
                gt: 0
            },
            message: 'Page param must be great 0'
        },
        {
            name: "page_size",
            rule: "notEmptySetDefault",
            default : 10
        },
        {
            name: "page_size",
            rule: "isInt",
            options: {
                gt: 0,
                lt: 101
            },
            message: 'Page size must be less or equal 100'
        },
        {
            name: "order",
            rule: "notEmptySetDefault",
            default: "warehouse_name"
        },
        {
            name: "direction",
            rule: "notEmptySetDefault",
            default: "asc"
        },
        {
            name: "direction",
            rule: "inValues",
            values: ['desc', 'asc'],
            message: "direction only desc or asc"
        },
        {
            name: "scenario",
            rule: "notEmptySetDefault",
            default: "pagination"
        },
        {
            name: "scenario",
            rule: "inValues",
            values: ['list', 'pagination']
        }
    ];

    validator.addRules(req.query, rules);

    validator.validate(actionCallback, function () {

        var cacheName = "equipment_list_" + req.query.page + "_" + req.query.page_size + "_" + req.query.order + "_" + req.query.direction + "_" + (req.query.filter ? sha1(JSON.stringify(req.query.filter)) : "");

        req.responseAction = {
            total: 0,
            limit: req.query.page_size,
            columns : [],
            list: []
        };

        var options = {
            functions: [
                getList
            ],
            db: {
                type: libMysql.const.readType
            },
            cache: {
                ttl: 300,
                name: cacheName
            },
            callback: actionCallback,
            workflow: {
                filename: __filename
            },
            permissions : {
                module : moduleModel.CONST_MODULE_EQUIPMENT,
                action : libPermission.ACTION_VIEW
            }
        };

        var layout = require(req.app.locals.appPath + "/traits/layouts/cacheLayout");
        layout(req, options);

        function getList(asyncObj, eachCallback) {
            (async() => {
                
                try {
                    const ModuleEquipmentClass = require("libs/class/generator/moduleEquipments");
                    const modelEquipment = require("models/equipment");
                    let moduleEquipment = new ModuleEquipmentClass({connection: asyncObj.connection, view: "Details", i18n: i18n, userId : req.jwt.token.uid, jwt : req.jwt.token});
                    let options = { mapping : modelEquipment.getMapper(),  enableDeletedCriteria : true, includeLines: false};
                    
                    moduleEquipment._hookListForSecondSQL = function(knexHelper, sql){
                        const calibrationTable = require('tables/vtiger_equipmentcalibrations');
                        const crmEntity = require('tables/vtiger_crmentity');
                        const equipmentTable = require('tables/vtiger_equipments');
                        const sub = knex(calibrationTable.table + ' as t')
                          .select(['calibrationid'])
                          .innerJoin(crmEntity.table, crmEntity.columns.crmid, 't.calibrationid')
                          .innerJoin(knex.raw("(select equipmentid , max(lastdate) as MaxDate, max(createdtime) as MaxCreatedTime from vtiger_equipmentcalibrations inner join vtiger_crmentity on calibrationid  = crmid group by equipmentid) as tm"), knex.raw("t.equipmentid = tm.equipmentid and t.lastdate = tm.MaxDate and vtiger_crmentity.createdtime = tm.MaxCreatedTime and vtiger_crmentity.deleted = 0"));
    
                        sql
                          .leftJoin(calibrationTable.table, knex.raw(`${calibrationTable.columns.calibrationid} in (${sub}) and ${calibrationTable.columns.equipmentid} = ${equipmentTable.columns.equipmentid}`));
                        return sql;
                    };

                    let error, data;
                    [error, data] = await to(moduleEquipment.getList(req, req.query.page, req.query.page_size, null, options));
                    req.responseAction = data;
                    eachCallback(error, asyncObj);

                } catch(e) {
                    console.error(e);
                    eachCallback(libApi.convertErrorToObject(e), asyncObj);
                }
            })()
        }
    });
};

exports.action = actionFunction;

exports.get = function (req, res, next) {
    actionFunction(req, res, function (context, err, data) {
        libApi.restResponse(res, req, err, data);
    })
};
