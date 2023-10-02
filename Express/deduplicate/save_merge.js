const libApi = require('libs/api');
const libMysql = require('libs/mysql');
const libValidator = require('libs/validator');
const crypt = require('./utils/EncryptDecrypt');
const moduleModel = require("models/module");
const libPermissions = require('libs/permissions');

const i18n = require("libs/i18n");
const helper = require("libs/helper");
const deduplicator = require("libs/deduplicator");
const config = require("config");

var actionFunction = function (req, res, actionCallback) {
  let rules = [
    {
      name: "primary_id",
      rule: "notEmpty",
      message: "Primary record not be empty"
    },
    {
      name: "module",
      rule: "notEmpty",
      message: "Module not be empty"
    },
    {
      name: "records",
      rule: "notEmpty",
      message: "Fields not be empty"
    },
    {
      name: "ignore_records",
      rule: "notEmptySetDefault",
      default: [],
    },
    {
      name: "field_list",
      rule: "notEmpty",
      message: "Fields not be empty"
    },
  ];

  i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
  let validator = new libValidator(i18n);

  validator.addRules(req.body, rules);

  validator.validate(actionCallback, function () {

    req.responseAction = null;

    const options = {
      functions: [
        getModuleDate
      ],
      db: {
        type: libMysql.const.readType
      },
      permissions : {
        module : moduleModel.CONST_MODULE_DEDUPLICATOR,
        action : libPermissions.ACTION_EDIT
      },
      callback: actionCallback,
      workflow: {
        filename: __filename
      }
    };

    var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
    layout(req, options);

    function getModuleDate(asyncObj, eachCallback) {
      (async() => {
        try {
          console.log('TEST_COMPANY_REQUEST IS ', req.jwt.token.cid);
          if (config.has('companies.' + req.jwt.token.cid + '.mysqlPoolCluster.master')) {
            const DB = config.get('companies.' + req.jwt.token.cid + '.mysqlPoolCluster.master') || {};
            const data = {
              params: {
                companyID: req.jwt.token.cid,
                module: req.body.module,
                recordIDs: req.body.records,
                ignoreIDs: req.body.ignore_records,
                primaryID: req.body.primary_id,
                userID: req.body.user_id,
                userEmail: req.body.user_email,
                crmURL: req.body.crm_url,
                mode: 'frontend',
                fieldsList: req.body.field_list
              },
              config: deduplicator.deduplicator.createConfig(req.jwt.token.cid, DB),
            };

            console.log('TEST_SEND_DATA ', data);

            deduplicator.ws.call('mergeRecords', data).then(result => {
              req.responseAction = result.res;
              console.log('TEST_SAVE_MERGE RESULT: ', JSON.parse(JSON.stringify(result)));
              if (result.err === 1) {
                eachCallback(result.error, asyncObj);
                return;
              }
              eachCallback(null, asyncObj);
            }).catch(error=> {
              console.log(error);
              eachCallback(error, asyncObj);
            })
          } else {
            throw new Error('Not found DB connection for company ' + req.jwt.token.cid);
          }
        } catch (e) {
          eachCallback(libApi.convertErrorToObject(e), asyncObj);
        }
      })();
    }
  });
};

exports.action = actionFunction;

exports.post = function (req, res, next) {
  actionFunction(req, res, function (context, err, data) {
    libApi.restResponse(res, req, err, data);
  })
};
