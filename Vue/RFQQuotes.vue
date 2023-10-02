<template>
  <div>
    <el-dialog append-to-body :visible.sync="showQuotes" custom-class="dialog-created-quotes" @open="visibleTableQuotes = true" @closed="handleDialogClose">
      <template slot="title">{{ translate.RFQ_TITLE_DIALOG_QUOTE }}</template>
      <el-table
        v-loading="quoteLoading"
        @row-click="handleRowClick"
        :data="quotesList"
        v-if="visibleTableQuotes"
        :default-sort="{ prop: 'quote_no', order: 'ascending' }"
        height="320"
        class="created-quotes-table"
        header-cell-class-name="created-quotes-table__th"
        row-class-name="created-quotes-table__tr"
        cell-class-name="created-quotes-table__td">
        <el-table-column
          v-if="!showQuotesReadonly"
          prop=""
          label=""
          width="40">
          <template slot-scope="scope">
            <div class="form-radio">
              <input
              class="form-radio__input"
              :id="`quote-${scope.$index}`"
              type="radio"
              name="quotes"
              @change="handleQuoteCheck(scope.row.quote_id)"
              exclude-row-click>
              <label class="form-radio__label" :for="`quote-${scope.$index}`" exclude-row-click>
                <span class="form-radio__icon"></span>
              </label>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="quote_no"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_QUOTE_NO"
          width="95">
        </el-table-column>
        <el-table-column
          prop="quote_stage"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_STAGE"
          width="145">
        </el-table-column>
        <el-table-column
          prop="accountname"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_ACCOUNT"
          width="165">
        </el-table-column>
        <el-table-column
          prop="contact_name"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_CONTACT_NAME"
          width="165">
        </el-table-column>
        <el-table-column
          prop="total"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_TOTAL"
          width="145">
          <template slot-scope="scope">
            {{ scope.row.total | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="assigned_name"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_ASSIGNED_TO"
          width="145">
        </el-table-column>
        <el-table-column
          prop="tsale"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_TERMS_SALE"
          width="155">
        </el-table-column>
        <el-table-column
          prop="tdelivery"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_TERMS_DELIVERY"
          width="155">
        </el-table-column>
        <el-table-column
          prop="pdelivery"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_PLACE_DELIVERY"
          width="155">
        </el-table-column>
        <el-table-column
          prop="tail_number"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_AIRCRAFT"
          width="145">
        </el-table-column>
        <el-table-column
          prop="location_name"
          :label="translate.RFQ_TABLE_TH_DIALOG_QUOTE_LOCATION"
          min-width="145">
        </el-table-column>
      </el-table>
      <template slot="footer">
        <div class="dialog-created-quotes__footer" v-show="!showQuotesReadonly">
          <button class="btn btn--theme dialog-created-quotes__btn" :disabled="!quoteId || !rfqId" @click="rfqValidate(false)">
            {{ translate.RFQ_BUTTON_DIALOG_QUOTE_OVERWRITE }}
          </button>
          <button class="btn btn--theme-green dialog-created-quotes__btn" :disabled="!rfqId || alreadyClickNewQuote" @click="rfqValidate(true)">
            {{ translate.RFQ_BUTTON_DIALOG_QUOTE_CREATE_NEW }}
          </button>
        </div>
      </template>
    </el-dialog>
    <el-dialog append-to-body :visible.sync="showValidateRfq" custom-class="dialog-validate" @closed="handleCloseValidateDialog">
      <template slot="title">
        <div class="rfq-duplicate-header">
          {{ translate.RFQ_TITLE_DIALOG_VALIDATE_RFQ }}
        </div>
      </template>
      <el-tabs tab-position="left" :class="'dialog-validate-tabs'">
        <el-tab-pane :label="item.pn" v-for="(item,key) in tabPn" :key="key">
          <div class="rfq-duplicate__body">
              <div class="rfq-duplicate-recommended">
                <div class="rfq-duplicate-title">
                  {{ translate.RFQ_LABEL_DIALOG_VALIDATE_RFQ_RECOMMENDED_DESC }}
                </div>
                <div class="rfq-duplicate-content">
                  <el-radio-group v-model="radio[key]">
                    <el-radio :label="item.descriptions[0]">{{item.descriptions[0].description}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="rfq-duplicate-options" v-if="item.descriptions.length > 1">
                <div class="rfq-duplicate-title">
                  {{ translate.RFQ_LABEL_DIALOG_VALIDATE_RFQ_STORED_DESC }}
                </div>
                <div class="rfq-duplicate-content">
                  <el-radio-group v-model="radio[key]">
                    <div v-for="(desc,num) in item.descriptions" class="rfq-duplicate-content__row" v-if="num !== 0" :key="num">
                        <el-radio :label="desc">{{desc.description}}</el-radio>
                    </div>
                  </el-radio-group>
                </div>
              </div>
              <div class="rfq-duplicate-current">
                <div class="rfq-duplicate-title">
                  {{ translate.RFQ_LABEL_DIALOG_VALIDATE_RFQ_CURRENT_DESC }}
                </div>
                <div class="rfq-duplicate-content">
                  <el-radio-group v-model="radio[key]">
                    <el-radio :label="item">{{item.description}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template slot="footer">
        <button class="btn btn--theme" @click="handleQuickSaveValidate">
          {{ translate.RFQ_BUTTON_DIALOG_VALIDATE_RFQ_ACCEPT_RECOMMENDATION }}
        </button>
        <button class="btn btn--theme" @click="handleSaveValidate">
          {{ translate.RFQ_BUTTON_DIALOG_VALIDATE_RFQ_ACCEPT }}
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Dialog, Table, TableColumn, Tabs, TabPane, Radio, RadioGroup, RadioButton } from 'element-ui';
import { RFQ_NAMESPACE } from '@/store/namespaces';
import { RFQ_SET_FLAG, RFQ_CLEAR_QUOTES, RFQ_QUOTE_SAVED, RFQ_SET_LOADING_FLAG } from '@/store/modules/rfq/mutation.types';
import { rfqKeyNames } from '@/store/modules/rfq/key.names';
import { getNS } from '@/store';
import config from '@/config';

export default {
  name: 'RFQQuotes',
  components: {
    'el-dialog': Dialog,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  props: {
    translate: Object,
  },
  data() {
    return {
      quoteId: null,
      visibleTableQuotes: false,
      showValidateRfq: false,
      preloader: null,
      tabPn: [],
      radio: [],
      preparationRequest: [],
      quoteOption: '',
    };
  },
  computed: {
    rfqId() {
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ID];
    },
    quotesList() {
      const list = this.$store.state[RFQ_NAMESPACE].quotes;
      return !list ? [] : JSON.parse(list);
    },
    quoteLoading() {
      return this.$store.state[RFQ_NAMESPACE].loading.getQuotes;
    },
    alreadyClickNewQuote() {
      return this.$store.state[RFQ_NAMESPACE].loading.alreadyClickNewQuote;
    },
    saveQuoteLoading() {
      return this.$store.state[RFQ_NAMESPACE].loading.saveQuote;
    },
    showQuotes: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].flags.showQuotes;
      },
      set(value) {
        this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_FLAG]), {
          name: 'showQuotes',
          value,
        });
      },
    },
    showQuotesReadonly: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].flags.showQuotesReadonly;
      },
      set(value) {
        this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_FLAG]), {
          name: 'showQuotesReadonly',
          value,
        });
      },
    },
  },
  watch: {
    saveQuoteLoading(newValue, oldValue) {
      if (newValue) {
        this.preloader = this.$loading();
      }

      if (oldValue && !newValue) {
        this.preloader.close();
      }
    },
  },
  methods: {
    handleQuoteCheck(id) {
      this.quoteId = id;
    },
    handleDialogClose() {
      this.visibleTableQuotes = false;
      this.showQuotes = false;
      if (this.showQuotesReadonly) {
        this.showQuotesReadonly = false;
      }
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_CLEAR_QUOTES]));
    },
    rfqValidate(newQuote) {
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_LOADING_FLAG]), {
        name: 'alreadyClickNewQuote',
        value: true,
      });
      this.$socket.sendObj({
        path: '/v1/rfq/validate',
        data: {
          emit: 'post:validate',
        },
        params: {
          rfq_id: this.rfqId,
        },
      });
      this.$socketBus.$once('post:validate', (payload) => {
        if (!payload.response.res) {
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_ERROR,
            dangerouslyUseHTMLString: true,
            message: payload.response.error,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
        }
        if (payload.response.data.length === 0) {
          this.handleQuoteSave(newQuote);
        } else {
          this.showValidateRfq = true;
          this.quoteOption = newQuote;
          this.createTabsPartsNumbers(payload.response.data);
        }
      });
    },
    createTabsPartsNumbers(data) {
      this.tabPn = data;
      data.forEach((item, key) => {
        this.radio[key] = item.descriptions[0];
        this.preparationRequest[key] = { hid: item.hid, description: item.descriptions[0].description };
      });
    },
    handleQuoteSave(newQuote) {
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_LOADING_FLAG]), {
        name: 'saveQuote',
        value: true,
      });
      this.$socket.sendObj({
        path: '/v1/rfq/quote/create',
        data: {
          response: {
            client: 'vue',
            options: {
              namespace: RFQ_NAMESPACE,
              mutation: RFQ_QUOTE_SAVED,
            },
          },
        },
        params: {
          rfq_id: this.rfqId,
          overwrite_quote_id: !newQuote ? this.quoteId : null,
        },
      });
    },
    handleRowClick(row, ev) {
      if (ev.target.hasAttribute('exclude-row-click')) return;
      // window.open(`/index.php?module=Quotes&view=Detail&record=${row.quote_id}`);
      window.open(`${row.quote_url}`);
    },
    handleSaveValidate() {
      this.preparationRequest.forEach((item, key) => {
        this.preparationRequest[key].description = this.radio[key].description;
      });
      this.saveAfterValidation();
    },
    handleQuickSaveValidate() {
      this.saveAfterValidation();
    },
    saveAfterValidation() {
      this.$socket.sendObj({
        path: '/v1/rfq/history/descriptions',
        data: {
          emit: 'post:changeDescriptions',
        },
        params: { objects: this.preparationRequest },
      });
      this.$socketBus.$once('post:changeDescriptions', (payload) => {
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
        this.handleQuoteSave(this.quoteOption);
      });
    },
    handleCloseValidateDialog() {
      this.showValidateRfq = false;
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_SET_LOADING_FLAG]), {
        name: 'alreadyClickNewQuote',
        value: false,
      });
      this.tabPn = [];
      this.radio = [];
      this.preparationRequest = [];
      this.quoteOption = '';
    },
  },
};
</script>
