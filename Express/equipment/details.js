const libApi = require('libs/api');
const libValidator = require('libs/validator');
const libMysql = require('libs/mysql');
const helper = require('libs/helper');
const lodash = require('lodash');
const moduleModel = require("models/module");
const ModuleEquipmentClass = require("libs/class/generator/moduleEquipments");
const libPermission = require("libs/permissions");
const knex = require('knex')({
    client: 'mysql'
});

const i18n = require("libs/i18n");
const config = require("config");

/**
 * @api {get} /v1/equipment/details Details
 * @apiDescription Details PO
 * @apiGroup PO
 *
 * @apiError (Error 200) {Number} res Result flag, 0.
 * @apiError (Error 200) {String} error  Error text.
 */


var actionFunction = function (req, res, actionCallback) {

    const modelEquipment = require("models/equipment");

    i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
    let validator = new libValidator(i18n);

    validator.addRules(req.query, [{
            name: "id",
            rule: "notEmpty"
        },
        {
            name: "user_id",
            rule: "notEmpty"
        },
        {
            name: "user_id",
            rule: "isInt",
            options: {
                gt: 0
            }
        }
    ]);

    validator.validate(actionCallback, function () {
        req.responseAction = {
            body : {},
        };

        var options = {
            functions: [
                getBody,
                // getCalibrations,
            ],
            db: {
                type: libMysql.const.readType
            },
            cache: {
                name: null
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

        var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
        layout(req, options);

        function getBody(asyncObj, eachCallback) {
            (async() => {
                try {
                    let moduleEquipment = new ModuleEquipmentClass({connection : asyncObj.connection, view : "Details", i18n: i18n, userId : req.jwt.token.uid, jwt : req.jwt.token});
                    
                    moduleEquipment._hookDetailsBeforeSql = function(knexHelper, sql){
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
                    
                    let data = await moduleEquipment.getDetails(req.query.id, {mapping : modelEquipment.getMapper()});
                    if(data) {
                        req.responseAction = Object.assign({}, req.responseAction, data);
                        eachCallback(null, asyncObj);
                    } else {
                        helper.set(req, "system.errorCode", 403);
                        eachCallback(i18n.__("global.entity.not_found_or_permissions"), asyncObj);
                    }
                } catch(e) {
                    console.error(e);
                    eachCallback(libApi.convertErrorToObject(e), asyncObj);
                }
            })();
        }
    })
};

exports.action = actionFunction;


exports.get = function (req, res, next) {
    actionFunction(req, res, function (context, err, data) {
        libApi.restResponse(res, req, err, data);
    })
};
