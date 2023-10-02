<template>
    <div class="rfq" v-if="translate">
      <rfq-quotes :translate="translate"></rfq-quotes>
      <div class="rfq-body">
            <div class="rfq-body__left">
                <rfq-info-sidebar
                    :translate="translate"
                    :active="currentActionView === infoView"
                    @click.native="toggleView(infoView)"
                    @select-focus="toggleView(infoView)">
                </rfq-info-sidebar>
                <rfq-parts-sidebar
                    :translate="translate"
                    :active="currentActionView === partsView"
                    @click.native="toggleView(partsView)"
                    @select-focus="toggleView(partsView)">
                </rfq-parts-sidebar>
            </div>
            <div class="rfq-body__right">
                <keep-alive>
                    <component :is="currentActionView" :disabled="partListEmpty" :translate="translate"></component>
                </keep-alive>
            </div>
          <el-dialog append-to-body :visible.sync="showAutoQuoteDialog" custom-class="dialog-auto-quote">
              <template slot="title">
                  <span class="dialog-auto-quote--title">
                    {{ translate.RFQ_TITLE_DIALOG_AUTO_QUOTE }}
                  </span>
              </template>
              <div class="dialog-auto-quote-message">{{messageBeforeStartAutoQuote}}</div>
              <div class="dialog-auto-quote-row">
                  <div class="dialog-auto-quote-block">
                      <div class="dialog-auto-quote-block--label">
                        {{ translate.RFQ_LABEL_DIALOG_AUTO_QUOTE_RATE }}
                      </div>
                      <div class="dialog-auto-quote-block--value">
                          <el-input-number v-model="autoQuoteRate" :min="0.1" class="dialog-auto-quote--rate"></el-input-number>
                      </div>
                  </div>
                  <div class="dialog-auto-quote-block">
                      <div class="dialog-auto-quote-block--label">
                        {{ translate.RFQ_LABEL_DIALOG_AUTO_QUOTE_RESTRICTION }}
                      </div>
                      <div class="dialog-auto-quote-block--value">
                          <el-input-number v-model="autoQuoteRestrictionDays" class="dialog-auto-quote--days"></el-input-number>
                      </div>
                  </div>
              </div>
              <template slot="footer">
                  <div class="dialog-auto-quote--footer">
                      <el-popover
                              placement="top"
                              popper-class="dialog-auto-quote-popover"
                              width="270"
                              v-model="visibleStartAutoQuotePopover"
                              trigger="click">
                          <p class="dialog-auto-quote-popover--text">{{messageStartAutoQuote}}</p>
                          <div style="text-align: center; margin: 0">
                              <button class="btn dialog-auto-quote-popover--cancel" @click="visibleStartAutoQuotePopover = false">
                                {{ translate.RFQ_BUTTON_DIALOG_AUTO_QUOTE_CANCEL }}
                              </button>
                              <button class="btn dialog-auto-quote-popover--confirm" @click="startAutoQuote">
                                {{ translate.RFQ_BUTTON_DIALOG_AUTO_QUOTE_CONFIRM }}
                              </button>
                          </div>
                          <template slot="reference">
                              <button class="btn btn--theme">
                                {{ translate.RFQ_BUTTON_DIALOG_AUTO_QUOTE_START }}
                              </button>
                          </template>
                      </el-popover>
                  </div>
              </template>
          </el-dialog>
      </div>
<!--      <dialog-list-vendors-->
<!--        :show.sync="visibleDialogVendors"-->
<!--        @closed="onDialogVendorClose"-->
<!--        @select="handleVendorSelect"/>-->
      <dialog-list-constructor
        v-if="visibleDialogVendors"
        :show.sync="visibleDialogVendors"
        :config="vendorDialogConfig"
        @select="handleVendorSelect"
        @open-create-dialog="openCreateDialog">
      </dialog-list-constructor>
      <el-dialog
        v-if="visibleDialogCreate"
        title="Create Dialog"
        custom-class="dialog-create-modal"
        width="80%"
        lock-scroll
        append-to-body
        :visible="visibleDialogCreate"
        @close="closeCreateDialog">
        <detail-create
          v-bind="createModuleConfig.props"
          :in-modal="true"
          :autocomplete-fields="createAutoFields"
          @create-end="closeCreateDialog"
        />
      </el-dialog>
    </div>
</template>

<script>
import { getNS } from '@/store';

import {
    AUTH_NAMESPACE,
    CONTROLS_NAMESPACE,
    RFQ_COMBO_NAMESPACE_PARTS,
    RFQ_NAMESPACE,
    RFQ_NAMESPACE_PARTS,
    SOCKET_NAMESPACE
} from '@/store/namespaces';
import {Dialog, Input, InputNumber, Option, Popover, Select} from 'element-ui';
import { getValueByPath } from 'element-ui/src/utils/util';
import {
    CONTROLS_ACTION_GET_ASSIGNED_TO,
    CONTROLS_ACTION_GET_CURRENCY_LIST,
    CONTROLS_ACTION_GET_STATIC_SELECTS
} from '@/store/modules/controls/action.types';
import {
    RFQ_ACTION_SAVE,
    RFQ_ACTION_SET_DEFAULTS,
    RFQ_ACTION_SET_DETAILS,
    RFQ_ACTION_SHOW_QUOTES
} from '@/store/modules/rfq/action.types';
import {searchMarket} from '@/store/modules/rfq/parts/actions';
import {DetailCreate, DialogListConstructor, DialogListVendors, mixinDetailConfig} from '@/components/common/index';
import {
    RFQ_CLEAR_FLAGS,
    RFQ_INFO_CLEAR,
    RFQ_INFO_CLEAR_ACCOUNT_RATES,
    RFQ_INFO_SAVE_CURRENCY,
    RFQ_INFO_SET_DATA,
    RFQ_INFO_SET_PROPERTY,
    RFQ_PARTS_CLEAR,
    RFQ_PARTS_SET_PARTS_LIST,
    RFQ_PARTS_SET_VALIDATION_RULES,
    RFQ_SAVE_TRANSLATE,
    RFQ_SET_DEFAULTS,
    RFQ_SET_FLAG,
    RFQ_SET_LOADING_FLAG,
    RFQ_SET_MODULE_CONFIG,
    RFQ_SET_VALIDATION_RULES
} from '@/store/modules/rfq/mutation.types';
import {controlsKeyNames} from '@/store/modules/controls/key.names';
import {partKeyNames, rfqKeyNames} from '@/store/modules/rfq/key.names';
// import { navKeyNames } from '@/store/modules/nav/key.names';
import config from '@/config';
import {mapGetters, mapMutations} from 'vuex';
import {translateMixin} from '@/mixins';

import RFQInfoSidebar from './info/Sidebar';
import RFQPartsSidebar from './parts/Sidebar';
import RFQInfoView from './info/View';
import RFQPartsView from './parts/View';
import RFQQuotes from './RFQQuotes';

const picklistsNames = 'tsale, tdelivery, rpriority, territory, rfqstatus, usageunit, pn_condition, pn_trace, pn_tag, warranty';

export default {
  name: 'ModuleRFQ',
  components: {
    'rfq-info-sidebar': RFQInfoSidebar,
    'rfq-parts-sidebar': RFQPartsSidebar,
    'rfq-info-view': RFQInfoView,
    'rfq-parts-view': RFQPartsView,
    'rfq-quotes': RFQQuotes,
    'el-dialog': Dialog,
    'el-input-number': InputNumber,
    'el-input': Input,
    'el-popover': Popover,
    'el-select': Select,
    'el-option': Option,
    DialogListVendors,
    DialogListConstructor,
    DetailCreate,
  },
  mixins: [translateMixin, mixinDetailConfig('RFQ')],
  props: ['content'],
  beforeCreate() {
    this.infoView = 'rfq-info-view';
    this.partsView = 'rfq-parts-view';
    this.defaultVendorDialogFor = 'part';
    // this.$store.registerModule(RFQ_NAMESPACE, RFQStore);
  },
  beforeMount() {
    this.loadConfig();
  },
  // destroyed() {
  //   this.$store.unregisterModule(RFQ_NAMESPACE);
  // },
  created() {
    this.preloader = this.$loading();
    this.getModuleConfigMixin((data) => {
        this[RFQ_SET_MODULE_CONFIG](data);
    });

    if (this.socketReady) {
      this.getRfqData();
      this.firstLoadRFQ();
      this.getTranslateMixin({ module: 'RFQ', saveLocally: false });
    } else {
      const unwatch = this.$watch('socketReady', () => {
        this.getRfqData();
        this.firstLoadRFQ();
        this.getTranslateMixin({ module: 'RFQ', saveLocally: false });
        unwatch();
      });
    }
    this.$once('translateLoad:success', (translate) => {
      this.setTranslate(translate);
      document.title = this.translate.RFQ_TITLE_PAGE_NEW;
      this.messageStartAutoQuote = this.translate.RFQ_TEXT_AUTO_QUOTE;
      this.messageBeforeStartAutoQuote = this.translate.RFQ_TEXT_BEFORE_AUTO_QUOTE;
    });

    this.$commonBus.$on('open:vendor-list-dialog', (type) => {
      if (!this.visibleDialogVendors && !this.vendorDialogConfig) {
          this.loadConfig('open:vendor-list-dialog', type);
          return;
      }
      this.visibleDialogVendors = true;
      if (type) {
        this.dialogVendorsSelectFor = type;
      }
    });
  },
  destroyed() {
    this.$commonBus.$off('open:vendor-list-dialog');
  },
  data() {
    return {
      preloader: null,
      currentActionView: this.partsView,
      showAutoQuoteDialog: false,
      autoQuoteRate: 0.8,
      autoQuoteRestrictionDays: 30,
      messageStartAutoQuote: '',
      messageBeforeStartAutoQuote: '',
      visibleStartAutoQuotePopover: false,
      visibleDialogVendors: false,
      dialogVendorsSelectFor: this.defaultVendorDialogFor, // or 'email'
      visibleDialogCreate: false,
      createModuleConfig: null,
      vendorDialogConfig: null,
    };
  },
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS,
      [
        'getPartProperty',
      ]),
      moduleData() {
        return {
            id: this.rfqId,
            ...this.rfqDefaults,
        }
      },
      createAutoFields() {
        if (this.createModuleConfig && this.createModuleConfig.defaultFields) {
          const fieldsKeys = Object.keys(this.createModuleConfig.defaultFields);
          return fieldsKeys.map((key) => {
            return {
              path: key,
              value: getValueByPath(this.moduleData, this.createModuleConfig.defaultFields[key]) || this.createModuleConfig.defaultFields[key]
            };
          });
        }
        return [];
      },
    socketReady() {
      return this.$store.getters.socketReady;
    },
    socketWasReconnect() {
      return this.$store.state[SOCKET_NAMESPACE].wasReconnection;
    },
    screenLoader() {
      return this.$store.getters[getNS([RFQ_NAMESPACE, 'screenLoader'])] || this.translateLoadingMixin || this.flagSearchPartInfo;
    },
    loading() {
      return this.socketReady && this.screenLoader;
    },
    flagSearchPartInfo() {
      return this.$store.state[RFQ_NAMESPACE].loading.searchPartInfo;
    },
    partListEmpty() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].list.length === 0;
    },
    isDefaultsLoaded() {
      return Object.keys(this.$store.state[RFQ_NAMESPACE].defaults).length > 0;
    },
    flagSaveAndNew: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].flags.saveAndNew;
      },
      set(value) {
        this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_FLAG]), {
          name: 'saveAndNew',
          value,
        });
      },
    },
    flagJustSave: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].flags.justSave;
      },
      set(value) {
        this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_FLAG]), {
          name: 'justSave',
          value,
        });
      },
    },
    selectStatus() {
      return this.$store.state[CONTROLS_NAMESPACE].static[controlsKeyNames.RFQ_STATUS];
    },
    rfqId() {
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ID];
    },
    rfqNumber() {
      if (this.$store.state[RFQ_NAMESPACE] === undefined) {
        return null;
      }
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.NUMBER];
    },
    rfqDefaults() {
      return this.$store.state[RFQ_NAMESPACE].defaults;
    },
    isRequestChanged() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].list.some(item => this.getPartProperty({
        type: partKeyNames.FLAGS,
        name: partKeyNames.FLAG_CHANGED_REQUEST,
        target: item,
      }));
    },
    isNewParts() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].list.some(item => item[partKeyNames.RESPONSE].res_id === null);
    },
    translate() {
      return this.$store.state[RFQ_NAMESPACE].translate;
    },
  },
  watch: {
    socketReady(newValue) {
      // if socket drop connection or socket was reconnected at once do nothing
      if (!newValue || this.socketWasReconnect) {
        this.preloader.close();
        return;
      }
      this.getRfqData();
      this.firstLoadRFQ();
    },
    loading(newValue, oldValue) {
      if (newValue) {
        this.preloader = this.$loading();
      }
      if (!newValue && oldValue) this.preloader.close();
    },
    rfqNumber(newValue) {
      if (newValue !== null) {
        document.title = newValue;
      }
    },
    flagSaveAndNew(newValue) {
      if (newValue) {
        this.clearSaveAndNew();
      }
    },
    $route: 'getRfqData',
  },
  methods: {
    firstLoadRFQ() {
      this.$store.dispatch({
        type: getNS([CONTROLS_NAMESPACE, CONTROLS_ACTION_GET_STATIC_SELECTS]),
        params: { n: picklistsNames },
      });
      this.$store.dispatch({
        type: getNS([CONTROLS_NAMESPACE, CONTROLS_ACTION_GET_ASSIGNED_TO]),
      });
      this.$store.dispatch({
        type: getNS([CONTROLS_NAMESPACE, CONTROLS_ACTION_GET_CURRENCY_LIST]),
      });

      if (!this.$route.params.id) {
        // if no RFQ id set default status
        const unwatch = this.$watch('selectStatus', () => {
          this[RFQ_INFO_SET_PROPERTY]({
            name: rfqKeyNames.STATUS,
            value: this.selectStatus[0],
          });
          unwatch();
        });
      }
    },
    setTranslate(translates) {
      this[RFQ_SAVE_TRANSLATE](translates);
      this[RFQ_SET_VALIDATION_RULES]({
        [rfqKeyNames.ACCOUNT_ID]: {
          message: translates.RFQ_TEXT_VALIDATION_ERR_ACCOUNT,
        },
        [rfqKeyNames.ASSIGNED_TO]: {
          message: translates.RFQ_TEXT_VALIDATION_ERR_ASSIGNED_TO,
        },
        ...this.$store.getters.enabledFeatures.RFQ.territoryRequired && { [rfqKeyNames.TERRITORY]: { message: translates.RFQ_TEXT_VALIDATION_ERR_TERRITORY } },
      });
      this[RFQ_PARTS_SET_VALIDATION_RULES](translates);
    },
    rfqSave(action) {
      this.$store.dispatch({
        type: getNS([RFQ_NAMESPACE, RFQ_ACTION_SAVE]),
        params: {
          type: !this.rfqId ? 'add' : 'edit',
          action,
        },
      });
    },
    rfqShowQuotes() {
      if (!this.rfqId) {
        this.$notify({
          title: this.translate.RFQ_TITLE_NOTIFY_QUOTES_NOT_ALLOWED,
          message: this.translate.RFQ_TEXT_NOTIFY_QUOTES_NOT_ALLOWED,
          type: 'error',
          duration: config.notificationErrorDuration,
          position: config.notificationPosition,
        });
        return;
      }

      this.$store.dispatch({
        type: getNS([RFQ_NAMESPACE, RFQ_ACTION_SHOW_QUOTES]),
        params: {
          showQuotesReadonly: true,
        },
      });
    },
    rfqAutoQuote() {
      if (!this.rfqId || this.isRequestChanged || this.isNewParts) {
        this.$notify({
          type: 'error',
          title: this.translate.RFQ_TITLE_NOTIFY_AUTO_QUOTE_SEARCH_ERR,
          message: this.translate.RFQ_TEXT_NOTIFY_AUTO_QUOTE_SEARCH_ERR,
          duration: config.notificationErrorDuration,
        });
        return;
      }
      this.showAutoQuoteDialog = true;
    },
    toggleView(view) {
      if (this.currentActionView !== view) {
        this.currentActionView = view;
      }
    },
    clearSaveAndNew() {
      this[RFQ_INFO_CLEAR]([
        rfqKeyNames.ID,
        rfqKeyNames.NUMBER,
        rfqKeyNames.CUSTOMER_QUOTE,
        rfqKeyNames.EXPIRATION_DATE,
        rfqKeyNames.DATE,
        rfqKeyNames.RECEIVED_VIA,
        rfqKeyNames.FLEET_ID,
        rfqKeyNames.LOCATION_ID,
      ]);
      this.clearRfq();
      if (this.$route.params.id) {
        // If action triggered on existing rfq with id, set flag to prevent common clear in watcher below
        this.flagJustSave = true;
        this.$router.replace({ params: { id: null } });
      }
    },
    clearRfq() {
      if (!this.flagSaveAndNew) {
        this[RFQ_INFO_CLEAR]();
        this[RFQ_INFO_CLEAR_ACCOUNT_RATES]();
        this[RFQ_SET_DEFAULTS]();
      }

      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.STATUS,
        value: !this.selectStatus ? null : this.selectStatus[0],
      });
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.PRIORITY,
        value: this.rfqDefaults[rfqKeyNames.PRIORITY] || null,
      });
      this[RFQ_PARTS_CLEAR]();
      this[RFQ_CLEAR_FLAGS]();
    },
    getRfqData() {
      if (!this.isDefaultsLoaded) {
        this[RFQ_SET_LOADING_FLAG]({
          name: 'defaults',
          value: true,
        });
        this.$socket.sendObj({
          path: '/v1/defaults/get',
          data: {
            response: {
              client: 'vue',
              options: {
                namespace: RFQ_NAMESPACE,
                action: RFQ_ACTION_SET_DEFAULTS,
              },
            },
          },
          params: {
            module: 'RFQ',
          },
        });
      }

      if (!this.flagJustSave && !this.flagSaveAndNew) {
        this.clearRfq();
      }

      // If spiders in process but user going to another rfq, clear spiders interval
      if (this.$store.state[RFQ_NAMESPACE].loading.searchMarket) {
        clearInterval(searchMarket.intervalFunctionId);
        this[RFQ_SET_LOADING_FLAG]({
          name: 'searchMarket',
          value: false,
        });
        searchMarket.counter = 0;
        searchMarket.intervalFunctionId = null;
      }

      if (
        this.$route.params.id === undefined
        || this.$route.params.id === null
        || this.flagJustSave
      ) {
        if (this.flagJustSave) {
          this.flagJustSave = false;
        }

        if (!this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY]) {
          this[RFQ_INFO_SAVE_CURRENCY](this.$store.state[AUTH_NAMESPACE].configCompany.currency);
        }

        return;
      }

      const dataOptions = {
        response: {
          client: 'vue',
          options: {
            namespace: RFQ_NAMESPACE,
            action: RFQ_ACTION_SET_DETAILS,
          },
        },
      };

      this[RFQ_SET_LOADING_FLAG]({
        name: 'data',
        value: true,
      });

      this.$socket.sendObj({
        path: '/v1/rfq/details',
        data: dataOptions,
        params: {
          rfq_id: this.$route.params.id,
        },
      });
    },
    startAutoQuote() {
      this.visibleStartAutoQuotePopover = false;
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_LOADING_FLAG]), {
        name: 'autoquote',
        value: true,
      });
      this.$socket.sendObj({
        path: '/v1/rfq/autoquote',
        data: {
          emit: 'post:autoquote',
        },
        params: {
          rfq_id: this.rfqId,
          rate: this.autoQuoteRate,
          days_restriction: this.autoQuoteRestrictionDays,
        },
      });
      this.$socketBus.$once('post:autoquote', (payload) => {
        this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_LOADING_FLAG]), {
          name: 'autoquote',
          value: false,
        });
        this.showAutoQuoteDialog = false;
        if (!payload.response.res) {
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_ERROR,
            message: payload.response.error,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
          return;
        }
        this[RFQ_PARTS_SET_PARTS_LIST](payload.response.data.partsList);
        this[RFQ_INFO_SET_DATA](payload.response.data.body);
        document.location.reload(true);
      });
    },
    handleVendorSelect(vendor) {
      this.$commonBus.$emit(`vendor-select:${this.dialogVendorsSelectFor}`, vendor);
      this.visibleDialogVendors = false;
    },
    openCreateDialog(createModuleConfig) {
      this.createModuleConfig = createModuleConfig;
      this.visibleDialogVendors = false;
      this.$nextTick(() => {
          this.visibleDialogCreate = true;
      });
    },
    closeCreateDialog() {
      this.visibleDialogCreate = false;
      this.$nextTick(() => {
          this.visibleDialogVendors = true;
      });
    },
    loadConfig(reCall = null, reCallType = null) {
      this.$socket.sendObj({
        path: '/v1/module/config',
        data: {
          emit: 'config:vendor_offer',
        },
        params: {
          module: 'VENDOR_OFFER',
          view: null,
        },
      });
      this.$socketBus.$once('config:vendor_offer', (payload) => {
        if (!payload.response.res) {
          return;
        }
        if (Array.isArray(payload.response.data.fields)) {
          const { fields } = payload.response.data;
          const vendorField = fields.find(field => field.field_code === 'vendor_offer_vendor');
          if (vendorField) {
            const vendorDialogConfig = typeof vendorField.source_params === 'object' ? vendorField.source_params.dialog : null;
            if (vendorDialogConfig) {
              this.vendorDialogConfig = vendorDialogConfig;
              if (reCall) {
                this.$commonBus.$emit(reCall, reCallType);
              }
              return;
            }
          }
        }
      });
    },
    onDialogVendorClose() {
      this.dialogVendorsSelectFor = this.defaultVendorDialogFor;
    },
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS, [
      RFQ_PARTS_SET_PARTS_LIST,
      RFQ_PARTS_CLEAR,
      RFQ_PARTS_SET_VALIDATION_RULES,
    ]),
    ...mapMutations(RFQ_NAMESPACE, [
      RFQ_SET_MODULE_CONFIG,
      RFQ_INFO_SET_DATA,
      RFQ_SET_LOADING_FLAG,
      RFQ_CLEAR_FLAGS,
      RFQ_INFO_SET_PROPERTY,
      RFQ_INFO_CLEAR,
      RFQ_INFO_CLEAR_ACCOUNT_RATES,
      RFQ_SET_DEFAULTS,
      RFQ_SAVE_TRANSLATE,
      RFQ_SET_VALIDATION_RULES,
      RFQ_INFO_SAVE_CURRENCY,
    ]),
  },
};
</script>
