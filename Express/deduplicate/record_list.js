const libApi = require('libs/api');
const libMysql = require('libs/mysql');
const libValidator = require('libs/validator');
const crypt = require('./utils/EncryptDecrypt');

const i18n = require("libs/i18n");
const helper = require("libs/helper");
const deduplicator = require("libs/deduplicator");
const config = require("config");

var actionFunction = function (req, res, actionCallback) {
  let rules = [
    {
      name: "module",
      rule: "notEmpty",
      message: "Module not be empty"
    },
    {
      name: "record_id",
      rule: "notEmpty",
      message: "Record not be empty"
    }
  ];

  i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')));
  let validator = new libValidator(i18n);

  validator.addRules(req.query, rules);

  validator.validate(actionCallback, function () {

    req.responseAction = null;

    const options = {
      functions: [
        getModuleDate
      ],
      db: {
        type: libMysql.const.readType
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
                module: req.query.module,
                mode: 'frontend',
                recordID: req.query.record_id,
              },
              config: deduplicator.deduplicator.createConfig(req.jwt.token.cid, DB),
            };

            console.log('TEST_SEND_DATA ', data);

            deduplicator.ws.call('listDuplicatesForRecord', data).then(result => {
              console.log('TEST_RECORD_LIST RESULT: ', JSON.parse(JSON.stringify(result)));
              req.responseAction = result.res;
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

exports.get = function (req, res, next) {
  actionFunction(req, res, function (context, err, data) {
    libApi.restResponse(res, req, err, data);
  })
};