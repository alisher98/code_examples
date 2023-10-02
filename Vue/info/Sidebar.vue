<template>
    <div class="block rfq-sidebar">
        <div class="block-header rfq-block-header rfq-sidebar__header" :class="{ 'rfq-sidebar__header--active': active }">
            {{ translate.RFQ_TITLE_SIDEBAR_INFO }}
            <!--<svg-sprite v-if="active" :icon="iconCheckSprite" class="svg-icon-check rfq-sidebar__header-icon"/>-->
        </div>
        <div class="block-content">
            <div class="form-group">
                <label class="form-label">{{ translate.RFQ_LABEL_SIDEBAR_RFQ_NO }}</label>
                <input id="rfq-number" v-model="rfqNumber" type="text" class="form-input form-input--readonly-default" readonly>
            </div>
            <div class="form-group"
                 :class="{ 'form-group--error form-group--error-input': validateRfq && !isValidInfo && !validationResults[rfqKeys.ACCOUNT_ID] }">
                <label class="form-label">{{ translate.RFQ_LABEL_SIDEBAR_ACCOUNT }} <span class="form-label-required">*</span></label>
                <!--TODO: On text change and on reselect prevent label blinking (because blur event fired before select) -->
                <form-input-controls @clear="handleAccountClear" :searchId="'rfq-search-account'" @search="toggleDialogAccounts">
                    <el-autocomplete
                      id="rfq-account"
                      :value="rfqAccountName"
                      :value-key="'accountname'"
                      :fetch-suggestions="getAccounts"
                      :trigger-on-focus="false"
                      :debounce="500"
                      :select-when-unmatched="true"
                      @select="handleAccountSelect"
                      @blur="handleAccountBlur"
                      class="rfq-sidebar__account"
                      :placeholder="translate.RFQ_PLACEHOLDER_SIDEBAR_ACCOUNT_SEARCH"
                      ref="autocomplete">
                    </el-autocomplete>
                    <dialog-list-constructor
                        v-if="visibleDialogAccounts"
                        :show.sync="visibleDialogAccounts"
                        :config="accountDialogConfig"
                        :data-obj="moduleData"
                        @select="handleAccountSelect"
                        @open-create-dialog="openCreateDialog($event, 'accounts')">
                    </dialog-list-constructor>
                </form-input-controls>
            </div>
            <div class="form-group" :class="{ 'form-group--disabled': !rfqAccountId }">
                <label class="form-label">{{ translate.RFQ_LABEL_SIDEBAR_CONTACT }}</label>
                <form-input-controls @clear="handleContactClear" @search="toggleDialogContacts" :searchId="'rfq-search-contact'">
                    <el-autocomplete
                      id="rfq-contact"
                      :value="rfqContactName"
                      :value-key="'contactname'"
                      :fetch-suggestions="getContacts"
                      :trigger-on-focus="false"
                      :debounce="500"
                      :select-when-unmatched="true"
                      @select="handleContactAutocomplete"
                      @blur="handleContactBlur"
                      class="rfq-sidebar__account"
                      :placeholder="translate.RFQ_PLACEHOLDER_SIDEBAR_CONTACT_SEARCH"
                      ref="autocomplete">
                    </el-autocomplete>
                    <dialog-list-constructor
                        v-if="visibleDialogContacts"
                        :show.sync="visibleDialogContacts"
                        :config="contactsDialogConfig"
                        :data-obj="moduleData"
                        @select="handleContactSelect"
                        @open-create-dialog="openCreateDialog($event, 'contacts')">
                    </dialog-list-constructor>
                  <!--<input type="text"
                         id="rfq-contact"
                         :value="rfqContactName"
                         placeholder="Select an Option"
                         @focus="emitSelectFocus(); toggleDialogContacts();"
                         class="form-input form-input--readonly-default"
                         readonly>-->
                </form-input-controls>
            </div>
            <div class="form-group">
                <label class="form-label">{{ translate.RFQ_LABEL_SIDEBAR_PRIORITY }}</label>
                <el-select
                    v-model="rfqPriority"
                    class="fixed-height"
                    id="rfq-priority"
                    :disabled="!rpriority"
                    @focus="emitSelectFocus"
                    :placeholder="translate.RFQ_PLACEHOLDER_SIDEBAR_PRIORITY">
                    <el-option
                        v-for="(item, index) in rpriority"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="rfq-sidebar__note">
                <svg-sprite :icon="iconInfoSprite" class="svg-icon-info rfq-sidebar__note-icon"/>
                <span v-html="translate.RFQ_TEXT_SIDEBAR_INFO"></span>
            </div>
        </div>
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
              :autocomplete-fields="createAutoFields"
              :in-modal="true"
              @create-end="closeCreateDialog"
            />
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Select, Option, Autocomplete, Dialog, Table, TableColumn, Input } from 'element-ui';
import { getValueByPath } from 'element-ui/src/utils/util';

import { getNS } from '@/store';
import { controlsKeyNames } from '@/store/modules/controls/key.names';
import { rfqKeyNames } from '@/store/modules/rfq/key.names';
import config from '@/config';

import {
  RFQ_NAMESPACE,
  CONTROLS_NAMESPACE,
} from '@/store/namespaces';
import {
  CONTROLS_ACTION_GET_FLEET,
  CONTROLS_ACTION_GET_LOCATIONS,
} from '@/store/modules/controls/action.types';
import {
  RFQ_INFO_SET_PROPERTY,
  RFQ_INFO_SAVE_ACCOUNT_RATES,
  RFQ_INFO_CLEAR_ACCOUNT_RATES,
  RFQ_INFO_UNSET_ACCOUNT,
  RFQ_INFO_VALIDATE,
  RFQ_INFO_SAVE_CURRENCY,
} from '@/store/modules/rfq/mutation.types';
import {
  CONTROLS_CLEAR_FIELDS,
} from '@/store/modules/controls/mutation.types';

import { SvgSprite, FormInputControls, Dropdown } from '@/components/gui';
import { DialogListConstructor, DetailCreate } from '@/components/common/index';
import {
  iconMagnifierSprite, iconPlusSprite,
  iconTrashSprite, iconInfoSprite,
} from 'svg';

// TODO: contacts preloader
export default {
  name: 'RFQInfoSidebar',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-autocomplete': Autocomplete,
    'el-dialog': Dialog,
    'el-table': Table,
    'el-input': Input,
    'el-table-column': TableColumn,
    Dropdown,
    SvgSprite,
    FormInputControls,
    DialogListConstructor,
    DetailCreate
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    translate: {
      type: Object,
    },
  },
  beforeCreate() {
    this.autocompleteMinChar = 3;
    this.rfqKeys = rfqKeyNames;
    this.iconPlusSprite = iconPlusSprite;
    this.iconTrashSprite = iconTrashSprite;
    this.iconMagnifierSprite = iconMagnifierSprite;
    this.iconInfoSprite = iconInfoSprite;
  },
  beforeMount() {
    this.loadConfig();
  },
  data() {
    return {
      contactsDialogConfig: null,
      accountDialogConfig: null,
      visibleDialogAccounts: false,
      visibleDialogContacts: false,
      visibleDialogCreate: false,
      createModuleConfig: null,
      reservedDialog: null,
    };
  },
  computed: {
    moduleData() {
      return {
        body: {
          account: {
            accountid: this.rfqAccountId,
            accountname: this.rfqAccountName,
          },
        },
      };
    },
    createAutoFields() {
      if (this.createModuleConfig && this.createModuleConfig.defaultFields) {
        const fieldsKeys = Object.keys(this.createModuleConfig.defaultFields);
        return fieldsKeys.map((key) => {
          let data = {
            path: key,
            value: getValueByPath(this.moduleData, this.createModuleConfig.defaultFields[key]) || this.createModuleConfig.defaultFields[key]
          };
          if (key === 'company') {
            data = {
              path: data.path,
              value: {
                ...data.value,
                company_id: data.value.accountid,
                company_name: data.value.accountname
              },
            };
          }
          return data;
        });
      }
      return [];
    },
    validateRfq() {
      return this.$store.state[RFQ_NAMESPACE].flags.validateRfq;
    },
    isValidInfo() {
      return this.$store.state[RFQ_NAMESPACE].flags.isValidInfo;
    },
    validationResults() {
      return this.$store.state[RFQ_NAMESPACE].flags.validationInfoResults;
    },
    rfqAccountName: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ACCOUNT_NAME];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.ACCOUNT_NAME,
          value,
        });
      },
    },
    rfqNumber: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.NUMBER];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.NUMBER,
          value,
        });
      },
    },
    rfqAccountId: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ACCOUNT_ID];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.ACCOUNT_ID,
          value,
        });
      },
    },
    rfqContactId: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.CONTACT_ID];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.CONTACT_ID,
          value,
        });
      },
    },
    rfqContactName: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.CONTACT_NAME];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.CONTACT_NAME,
          value,
        });
      },
    },
    rfqPriority: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.PRIORITY];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.PRIORITY,
          value,
        });
      },
    },
    ...mapState(RFQ_NAMESPACE, {
      moduleConfig: state => state.moduleConfig
    }),
    ...mapState(CONTROLS_NAMESPACE, {
      rpriority: state => state.static[controlsKeyNames.PRIORITY],
    }),
  },
  watch: {
    rfqAccountId() {
      if (this.validateRfq && !this.isValidInfo) {
        this[RFQ_INFO_VALIDATE]({ name: rfqKeyNames.ACCOUNT_ID });
      }
    },
  },
  methods: {
    toggleFromType(type) {
      // eslint-disable-next-line default-case
      switch (type) {
        case 'accounts':
          this.toggleDialogAccounts();
          break;
        case 'contacts':
          this.toggleDialogContacts();
          break;
      }
    },
    closeCreateDialog() {
      this.visibleDialogCreate = false;
      this.$nextTick(() => {
        if (this.reservedDialog) {
          this.toggleFromType(this.reservedDialog);
          this.reservedDialog = null;
        }
      });
    },
    openCreateDialog(createModuleConfig, dialogType) {
      this.createModuleConfig = createModuleConfig;
      this.reservedDialog = dialogType;
      this.toggleFromType(dialogType);
      this.$nextTick(() => {
        this.visibleDialogCreate = true;
      });
    },
    loadConfig(reCall = false) {
      const configData = this.moduleConfig;
      if (Array.isArray(configData.fields)) {
        const { fields } = configData;
        const accountField = fields.find(field => field.field_code === 'rfq_account');
        const contactField = fields.find(field => field.field_code === 'rfq_contact');
        if (accountField && contactField) {
          const accountDialogConfig = typeof accountField.source_params === 'object' ? accountField.source_params.dialog : null;
          const contactsDialogConfig = typeof contactField.source_params === 'object' ? contactField.source_params.dialog : null;
          if (accountDialogConfig && contactsDialogConfig) {
            this.accountDialogConfig = accountDialogConfig;
            this.contactsDialogConfig = contactsDialogConfig;
            if (reCall) {
              this[reCall]();
            }
          }
        }
      }
    },
    toggleDialogContacts() {
      if (!this.rfqAccountId) {
        return;
      }
      if (!this.visibleDialogContacts && !this.contactsDialogConfig) {
        this.loadConfig('toggleDialogContacts');
        return;
      }
      this.visibleDialogContacts = !this.visibleDialogContacts;
    },
    toggleDialogAccounts() {
      if (!this.visibleDialogAccounts && !this.accountDialogConfig) {
        this.loadConfig('toggleDialogAccounts');
        return;
      }
      this.visibleDialogAccounts = !this.visibleDialogAccounts;
    },
    getAccounts(query, callback) {
      if (query.length < this.autocompleteMinChar) { callback([]); return; }

      this.$socket.sendObj({
        path: '/v1/account/list',
        data: {
          emit: 'autocomplete:accounts',
        },
        params: {
          order: 'accountname',
          direction: 'asc',
          filter: { accountname: query },
        },
      });

      this.$socketBus.$once('autocomplete:accounts', (payload) => {
        if (!payload.response.res) {
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_ACCOUNT_SEARCH_ERROR,
            message: payload.response.error,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
          return;
        }
        callback(payload.response.data);
      });
    },
    getContacts(query, callback) {
      if (query.length < this.autocompleteMinChar) { callback([]); return; }

      this.$socket.sendObj({
        path: '/v1/account/contact/list',
        data: {
          emit: 'autocomplete:contacts',
        },
        params: {
          order: 'contactname',
          account_id: this.rfqAccountId,
          scenario: 'list',
          direction: 'asc',
          filter: { contactname: query },
        },
      });

      this.$socketBus.$once('autocomplete:contacts', (payload) => {
        if (!payload.response.res) {
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_CONTACT_SEARCH_ERROR,
            message: payload.response.error,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
          return;
        }
        callback(payload.response.data);
      });
    },
    getLocationList() {
      this.$store.dispatch({
        type: getNS([CONTROLS_NAMESPACE, CONTROLS_ACTION_GET_LOCATIONS]),
        params: {
          account_id: this.rfqAccountId,
        },
      });
    },
    getFleetList() {
      this.$store.dispatch({
        type: getNS([CONTROLS_NAMESPACE, CONTROLS_ACTION_GET_FLEET]),
        params: {
          account_id: this.rfqAccountId,
        },
      });
    },
    handleAccountSelect(account) {
      this.clearAccountRelatedFields();
      this.rfqAccountId = account.accountid;
      this.rfqAccountName = account.accountname;
      this[RFQ_INFO_SAVE_ACCOUNT_RATES](account.ratios);
      this[RFQ_INFO_SAVE_CURRENCY](account.currency);
      if (account[rfqKeyNames.ASSIGNED_TO]) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.ASSIGNED_TO,
          value: +account[rfqKeyNames.ASSIGNED_TO],
        });
      }
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.DESCRIPTION,
        value: account[rfqKeyNames.DESCRIPTION],
      });
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.TERMS_OF_DELIVERY,
        value: account[rfqKeyNames.TERMS_OF_DELIVERY],
      });
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.TERMS_OF_SALE,
        value: account[rfqKeyNames.TERMS_OF_SALE],
      });
      if (account[rfqKeyNames.TERRITORY]) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.TERRITORY,
          value: account[rfqKeyNames.TERRITORY],
        });
      }
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.PLACE_OF_DELIVERY,
        value: account[rfqKeyNames.PLACE_OF_DELIVERY],
      });
      this[RFQ_INFO_SAVE_CURRENCY](account[rfqKeyNames.CURRENCY]);
      if (this.visibleDialogAccounts) {
        this.toggleDialogAccounts();
      }
      this.getLocationList();
      this.getFleetList();
    },
    handleAccountBlur(ev) {
      if (ev.target.value !== this.rfqAccountName) {
        this.$refs.autocomplete.$refs.input.setCurrentValue(this.rfqAccountName);
      }
    },
    handleContactBlur(ev) {
      if (ev.target.value !== this.rfqContactName) {
        this.$refs.autocomplete.$refs.input.setCurrentValue(this.rfqContactName);
      }
    },
    handleAccountClear() {
      this.rfqAccountName = null;
      this.handleContactClear();
      this.clearAccountRelatedFields();
    },
    handleContactSelect(contact) {
      this.rfqContactId = contact.contactid;
      this.rfqContactName = `${contact.firstname} ${contact.lastname}`;
      this.toggleDialogContacts();
    },
    handleContactAutocomplete(contact) {
      this.rfqContactId = contact.contactid;
      this.rfqContactName = contact.contactname;
    },
    clearAccountRelatedFields() {
      this[RFQ_INFO_UNSET_ACCOUNT]();
      this[RFQ_INFO_CLEAR_ACCOUNT_RATES]();
      this.$store.commit(getNS([CONTROLS_NAMESPACE, CONTROLS_CLEAR_FIELDS]), [
        controlsKeyNames.ACCOUNTS,
        controlsKeyNames.CONTACTS,
        controlsKeyNames.FLEET,
        controlsKeyNames.LOCATIONS,
      ]);
    },
    handleContactClear() {
      this.rfqContactId = null;
      this[RFQ_INFO_SET_PROPERTY]({
        name: rfqKeyNames.CONTACT_NAME,
        value: null,
      });
    },
    emitSelectFocus() {
      this.$emit('select-focus');
    },
    ...mapMutations(RFQ_NAMESPACE, [
      RFQ_INFO_SET_PROPERTY,
      RFQ_INFO_SAVE_ACCOUNT_RATES,
      RFQ_INFO_CLEAR_ACCOUNT_RATES,
      RFQ_INFO_UNSET_ACCOUNT,
      RFQ_INFO_VALIDATE,
      RFQ_INFO_SAVE_CURRENCY,
    ]),
  },
};
</script>
