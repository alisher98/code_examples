const libApi = require('libs/api');
const libValidator = require('libs/validator');
const libMysql = require('libs/mysql');
const helper = require('libs/helper');
const bytes = require('bytes');
const moduleModel = require("models/module");
const libPermission = require("libs/permissions");
const async = require('async');
const knex = require('knex')({
  client: 'mysql'
});

/**
 * @api {get} /v1/equipment/line/relation/po_lines Line Relation for PO line
 * @apiDescription Get PO line for Equipment calibration
 * @apiGroup Equipment
 *
 * @apiParam {Number} po_id Product id
 * @apiParam {Number} user_id="Token user" User id
 *
 * @apiSuccess {Number} res Result flag, 1.
 * @apiSuccess {Object[]} data list so line.
 * @apiSuccess {Number} data.label SO line label.
 * @apiSuccess {Number} data.value SO line id.
 
 
 * @apiError (Error 200) {Number} res Result flag, 0.
 * @apiError (Error 200) {String} error  Error text.
 */


var actionFunction = function (req, res, actionCallback) {
  
     const i18n = require("libs/i18n");
    const config = require("config");
    const helper = require("libs/helper");
    i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
    let validator = new libValidator(i18n);
  validator.addRules(req.query, [
    {
      name: "product_id",
      rule: "notEmpty",
      message: "Part number field is empty.\n " + "First you should fill the Part number field and try to select a line again."
    },
    {
      name: "po_id",
      rule: "notEmpty",
      message: "Order field is empty.\n " + "First you should fill the Order field and try to select a line again."
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
    
    req.responseAction = [];
    
    var options = {
      functions: [
        getEmptySOLines,
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
        module : moduleModel.CONST_MODULE_PO,
        action : libPermission.ACTION_VIEW
      }
    };
    
    var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
    layout(req, options);
    
    function getEmptySOLines(asyncObj, eachCallback) {
      
      const vtiger_inventoryproductrel = require("tables/vtiger_inventoryproductrel");
      const vtiger_crmentity = require("tables/vtiger_crmentity");
      const vtiger_equipmentCalibrations = require("tables/vtiger_equipmentcalibrations");
      const vtiger_purchaseorder = require("tables/vtiger_purchaseorder");
  
      let usedPOLines = knex(vtiger_inventoryproductrel.table)
        .select([
          vtiger_inventoryproductrel.columns.lineitem_id
        ])
        .innerJoin(vtiger_equipmentCalibrations.table, vtiger_equipmentCalibrations.columns.worder_line, vtiger_inventoryproductrel.columns.lineitem_id)
        .innerJoin(vtiger_crmentity.table, vtiger_crmentity.columns.crmid, vtiger_equipmentCalibrations.columns.equipmentid)
        .whereNot(vtiger_crmentity.columns.deleted, 1);
  
      let queryBuilder = knex(vtiger_inventoryproductrel.table)
        .select([
          vtiger_inventoryproductrel.columns.lineitem,
          vtiger_inventoryproductrel.columns.lineitem_id,
          vtiger_purchaseorder.columns.purchaseorder_no,
          vtiger_purchaseorder.columns.purchaseorderid,
        ])
        .leftJoin(vtiger_purchaseorder.table, vtiger_purchaseorder.columns.purchaseorderid, vtiger_inventoryproductrel.columns.id)
        .leftJoin(vtiger_crmentity.table, vtiger_crmentity.columns.crmid, vtiger_inventoryproductrel.columns.id)
        .where(vtiger_purchaseorder.columns.purchaseorderid, req.query.po_id)
        .where(vtiger_crmentity.columns.deleted, 0)
        .where(vtiger_inventoryproductrel.columns.productid, req.query.product_id)
        .whereNotIn(vtiger_inventoryproductrel.columns.lineitem_id, usedPOLines)
        .whereNotIn(vtiger_purchaseorder.columns.postatus, ["Closed","Cancelled"]);
      
      
      asyncObj.connection.query(queryBuilder.toString(), (err, rows) => {
        if(err){
          eachCallback(err, asyncObj);
        } else {
          if(rows && rows.length > 0) {
            logger.info("Other PO found");
            for(var otherPO of rows) {
              req.responseAction.push({
                line_number : otherPO.purchaseorder_no + "/" + otherPO.lineitem,  //$row["salesorder_no"]."/".$row["lineitem"]." ".$row["accountname"]
                id: otherPO.purchaseorderid,
                line_id: otherPO.lineitem_id
              })
            }
            const findText = req.query.line_number && typeof req.query.line_number === 'string' ? req.query.line_number.trim() : '';
            if (findText) {
              req.responseAction = req.responseAction.filter(item => item.line_number.includes(findText));
            }
            eachCallback(null, asyncObj);
            
          } else {
            logger.info("Other PO not found");
            eachCallback(null, asyncObj);
          }
        }
      })
      
      
    }
    
  })
  
  
};

exports.action = actionFunction;


exports.get = function (req, res, next) {
  
  actionFunction(req, res, function (context, err, data) {
    libApi.restResponse(res, req, err, data);
  })
};
