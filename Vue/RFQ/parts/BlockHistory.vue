<template>
    <div class="block rfq-block-history" :class="{ 'rfq-block-history--emails': visibleEmailsDialog }" ref="reference">
        <div class="block-header block-header--theme rfq-block-header">
          {{ translate.RFQ_TITLE_PART_HISTORY_BLOCK }}
        </div>
        <div class="block-header rfq-block-history__header delete-top-border-radius">
            <div class="form-group form-group--row rfq-block-history__filters">
                <div class="form-group rfq-block-history__filter rfq-block-history__filter--vendor">
                    <el-select
                      v-model="filterByVendor"
                      :disabled="disabledFilterVendor"
                      @change="filterHistory"
                      id="rfq-vendor-filter"
                      filterable
                      clearable
                      :placeholder="translate.RFQ_PLACEHOLDER_PART_HISTORY_VENDOR_FILTER"
                      class="rfq-block-history__filter--ellipsis">
                      <el-option
                        v-for="(vendor, index) in selectVendors"
                        :key="index"
                        :label="vendor.name"
                        :value="vendor.code">
                      </el-option>
                    </el-select>
                </div>
                <div class="form-group rfq-block-history__filter rfq-block-history__filter--condition">
                    <el-select
                      v-model="filterByCondition"
                      :disabled="disabledFilterCondition"
                      id="rfq-condition-filter"
                      @change="filterHistory"
                      clearable
                      :placeholder="translate.RFQ_PLACEHOLDER_PART_HISTORY_CONDITION_FILTER">
                      <el-option
                        v-for="(item, index) in selectCondition"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </div>
                <div class="form-group rfq-block-history__filter rfq-block-history__filter--type">
                  <el-select
                    v-model="filterBySalesType"
                    :disabled="disabledFilterSalesType"
                    id="rfq-sales-filter"
                    @change="filterHistory"
                    clearable
                    :placeholder="translate.RFQ_PLACEHOLDER_PART_HISTORY_TYPE_FILTER"
                    class="rfq-block-history__filter--ellipsis">
                    <el-option
                      v-for="(item, index) in selectSalesType"
                      v-show="isILS ? item.value !== 'exchange' : true"
                      :key="index"
                      :label="isILS ? item.alias : item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
            </div>
            <div class="form-group form-group--row rfq-block-history__qty">
              <label class="form-label rfq-block-history__label">
                {{ translate.RFQ_LABEL_PART_HISTORY_QTY_FILTER }}:
              </label>
              <input
                type="text"
                id="rfq-qty-from-filter"
                v-model.lazy.trim="filterByQtyFrom"
                :disabled="disabledFilterQty"
                @change="filterHistory"
                class="form-input rfq-block-history__qty-from"
                :placeholder="translate.RFQ_PLACEHOLDER_FROM">
              <input
                type="text"
                id="rfq-qty-to-filter"
                v-model.lazy.trim="filterByQtyTo"
                :disabled="disabledFilterQty"
                @change="filterHistory"
                class="form-input rfq-block-history__qty-to"
                :placeholder="translate.RFQ_PLACEHOLDER_TO">
            </div>
            <div class="form-group form-group--row rfq-block-history__dates">
                <label class="form-label rfq-block-history__label">
                  {{ translate.RFQ_LABEL_PART_HISTORY_DATE_FILTER }}:
                </label>
                <div class="form-group rfq-block-history__date" id="rfq-date-filter" :class="{ 'rfq-block-history__date--selected': filterByDate}">
                    <el-date-picker
                      v-model="filterByDate"
                      :disabled="disabledFilterDate"
                      :format="dateFormat"
                      :value-format="dateFormat"
                      type="daterange"
                      range-separator=""
                      :start-placeholder="translate.RFQ_PLACEHOLDER_FROM"
                      :end-placeholder="translate.RFQ_PLACEHOLDER_TO"
                      @change="filterHistory">
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="block-content rfq-block-history__content">
          <div class="rfq-block-history__action">
            <button
              @click="toggleEmailsDialog"
              class="btn btn--theme rfq-block-history__action-btn rfq-block-history__action-btn--email">
              <span class="rfq-block-history__action-icon rfq-block-history__action-icon--email">
                 <svg-sprite :icon="iconEmail" class="svg-icon-email"/>
              </span>
            </button>
            <button
              class="btn btn--theme rfq-block-history__action-btn rfq-block-history__action-btn--search"
              :disabled="visibleEmailsDialog"
              @click="toggleSearchMarketDialog">
                {{ translate.RFQ_BUTTON_PART_MARKET }}
              <span class="rfq-block-history__action-icon  rfq-block-history__action-icon--arrows">
                 <svg-sprite
                   :icon="iconRoundedArrows" class="svg-icon-rounded-arrows svg-icon-rounded-arrows--white"
                   :class="{ 'rfq-block-history__action-icon--loading': searchMarketLoading }"/>
              </span>
            </button>
          </div>
            <el-tabs type="card" @tab-click="getHistory($event.name)" :value="currentHistoryTab">
                <el-tab-pane class="rfq-block-history__tab" :label="translate.RFQ_LABEL_PART_HISTORY_TAB_HISTORY" :name="HISTORY_TYPE.MAIN">
                    <rfq-history-main
                      v-if="currentHistoryTab === HISTORY_TYPE.MAIN"
                      :history="historyToDisplay"
                      :translate="translate"
                      @row-click="handleHistorySelect($event, HISTORY_TYPE.MAIN)"/>
                </el-tab-pane>
                <!--<el-tab-pane class="rfq-block-history__tab" label="ILS" :name="HISTORY_TYPE.ILS">-->
                    <!--<rfq-history-ils-->
                            <!--v-if="currentHistoryTab === HISTORY_TYPE.ILS"-->
                            <!--:history="historyToDisplay"-->
                            <!--@row-click="handleHistorySelect($event, HISTORY_TYPE.ILS)"/>-->
                <!--</el-tab-pane>-->
                <el-tab-pane class="rfq-block-history__tab" label="eMarts" :name="HISTORY_TYPE.ILSv2">
                  <rfq-history-ils
                    v-if="currentHistoryTab === HISTORY_TYPE.ILSv2"
                    :history="historyToDisplay"
                    :translate="translate"
                    @row-click="handleHistorySelect($event, HISTORY_TYPE.ILS)"/>
                </el-tab-pane>
                <!--<el-tab-pane class="rfq-block-history__tab" label="Recent Quotes" :name="HISTORY_TYPE.RECENT">-->
                    <!--<rfq-history-resq-->
                            <!--v-if="currentHistoryTab === HISTORY_TYPE.RECENT"-->
                            <!--:history="historyToDisplay"-->
                            <!--@row-click="handleHistorySelect($event, HISTORY_TYPE.RECENT)"/>-->
                <!--</el-tab-pane>-->
                <el-tab-pane
                  class="rfq-block-history__tab"
                  :label="`${translate.RFQ_LABEL_PART_HISTORY_TAB_CATALOG} ${lengthCatalog ? '*' : ''}`"
                  :name="HISTORY_TYPE.CATALOG">
                    <rfq-history-catalog
                      v-if="currentHistoryTab === HISTORY_TYPE.CATALOG"
                      :history="historyToDisplay"
                      :translate="translate"
                      @row-click="handleHistorySelect($event, HISTORY_TYPE.CATALOG)"/>
                </el-tab-pane>
                <el-tab-pane class="rfq-block-history__tab" :label="translate.RFQ_LABEL_PART_HISTORY_TAB_SITES" :name="HISTORY_TYPE.SITES">
                    <rfq-history-sites
                      v-if="currentHistoryTab === HISTORY_TYPE.SITES"
                      :history="historyToDisplay"
                      :translate="translate"
                      @row-click="handleHistorySelect($event, HISTORY_TYPE.SITES)"/>
                </el-tab-pane>
                <el-tab-pane
                  class="rfq-block-history__tab"
                  :label="`${translate.RFQ_LABEL_PART_HISTORY_TAB_INVENTORY} ${lengthInventory ? '*' : ''}`"
                  :name="HISTORY_TYPE.INVENTORY">
                    <rfq-history-inventory
                      v-if="currentHistoryTab === HISTORY_TYPE.INVENTORY"
                      :history="historyToDisplay"
                      :translate="translate"
                      @row-click="handleHistorySelect($event, HISTORY_TYPE.INVENTORY)"/>
                </el-tab-pane>
                <el-tab-pane
                  class="rfq-block-history__tab"
                  :label="`${translate.RFQ_LABEL_PART_HISTORY_TAB_ALTERNATIVE} ${lengthAlternative ? '*' : ''}`"
                  :name="HISTORY_TYPE.ALTERNATIVE">
                    <rfq-history-alt
                      v-if="currentHistoryTab === HISTORY_TYPE.ALTERNATIVE"
                      :history="historyToDisplay"
                      :translate="translate"/>
                </el-tab-pane>
                <el-tab-pane
                  class="rfq-block-history__tab"
                  :label="translate.RFQ_LABEL_PART_HISTORY_TAB_KITS"
                  :name="HISTORY_TYPE.KITS">
                    <rfq-history-kits
                      v-if="currentHistoryTab === HISTORY_TYPE.KITS"
                      :history="historyToDisplay"
                      :translate="translate"/>
                </el-tab-pane>
                <el-tab-pane
                  class="rfq-block-history__tab"
                  :label="`${translate.RFQ_LABEL_PART_HISTORY_TAB_CONSIGNMENT} ${lengthConsignment ? '*' : ''}`"
                  :name="HISTORY_TYPE.CONSIGNMENT">
                    <rfq-history-consignments
                      v-if="currentHistoryTab === HISTORY_TYPE.CONSIGNMENT"
                      @row-click="handleHistorySelect($event, HISTORY_TYPE.CONSIGNMENT)"
                      :history="historyToDisplay"
                      :translate="translate"/>
                </el-tab-pane>
            </el-tabs>
        </div>

      <rfq-send-emails :translate="translate" ref="popper" v-show="showPopper" :visible="showPopper"></rfq-send-emails>
      <backdrop :visible="showPopper" @click="toggleEmailsDialog"/>
      <el-dialog
        append-to-body
        :visible.sync="showDialogSearchMarket"
        custom-class="dialog-search-market"
        :title="translate.RFQ_TITLE_PART_DIALOG_MARKET"
        top="40vh">
        <button
          class="btn btn--theme rfq-block-history__action-btn rfq-block-history__action-btn--search rfq-block-history__action-btn--dialog"
          @click="handleSearchMarket">
          {{ translate.RFQ_BUTTON_DIALOG_MARKET_SEND_SPIDERS }}
          <span class="rfq-block-history__action-icon  rfq-block-history__action-icon--arrows">
            <svg-sprite
              :icon="iconRoundedArrows" class="svg-icon-rounded-arrows svg-icon-rounded-arrows--white"
              :class="{ 'rfq-block-history__action-icon--loading': searchMarketLoading && searchTypeSpiders }"/>
          </span>
        </button>
        <button
          class="btn btn--theme rfq-block-history__action-btn rfq-block-history__action-btn--search rfq-block-history__action-btn--dialog"
          @click="handleSearchMarket({ cache: 0 })">
<!--            {{ translate.RFQ_BUTTON_DIALOG_MARKET_SEND_ILS }}-->
            Send to Markets
            <span class="rfq-block-history__action-icon  rfq-block-history__action-icon--arrows">
              <svg-sprite
                :icon="iconRoundedArrows" class="svg-icon-rounded-arrows svg-icon-rounded-arrows--white"
                :class="{ 'rfq-block-history__action-icon--loading': searchMarketLoading && searchTypeILS}"/>
            </span>
        </button>
      </el-dialog>
      <dialog-add-part-uom
        v-if="showDialogAddPartConverterUom"
        :show="showDialogAddPartConverterUom"
        :pn="dialogAddPartConverterUomPn"
        :part="dialogAddPartConverterUomPart"
        :rates="dialogAddPartConverterUomRates"
        :mode="dialogAddPartConverterUomMode"
        @close="closeDialogAddPartUom">
      </dialog-add-part-uom>
    </div>
</template>

<script>
import { Select, Option, Tabs, TabPane, DatePicker, Dialog } from 'element-ui';
import Popper from 'element-ui/lib/utils/vue-popper';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import config from '@/config';

import {
  RFQ_PARTS_ACTION_GET_HISTORY,
  RFQ_PARTS_ACTION_GET_HISTORY_CATALOG,
  RFQ_PARTS_ACTION_GET_HISTORY_INVENTORY,
  RFQ_PARTS_ACTION_GET_HISTORY_ALTERNATIVE,
  RFQ_PARTS_ACTION_GET_HISTORY_KITS,
  RFQ_PARTS_ACTION_GET_HISTORY_CONSIGNMENT,
  RFQ_PARTS_ACTION_SPIDERS_TIMER,
  RFQ_ACTION_GET_PART_INFO,
} from '@/store/modules/rfq/action.types';
import {
  RFQ_PARTS_SET_DATA_FROM_HISTORY,
  RFQ_RATS_SET_HISTORY_TAB,
  RFQ_PARTS_SET_PART_HISTORY_PROPERTY,
  RFQ_PARTS_SET_DATA_FROM_HISTORY_INVENTORY,
  RFQ_PARTS_SET_DATA_FROM_HISTORY_CONSIGNMENT,
  RFQ_PARTS_SET_DATA_FROM_HISTORY_CATALOG,
  RFQ_PARTS_DEL_HISTORY,
  RFQ_SET_FLAG,
  RFQ_SET_LOADING_FLAG,
  RFQ_PARTS_SET_FROM_SNAPSHOT,
  RFQ_PARTS_SET_FLAG,
  RFQ_PARTS_SET_PART_PROPERTY,
  RFQ_PARTS_SET_CONVERTED_VALUES,
  RFQ_PARTS_SET_PART_CURRENT_UOM,
} from '@/store/modules/rfq/mutation.types';
import {
  RFQ_NAMESPACE,
  RFQ_NAMESPACE_PARTS,
  RFQ_COMBO_NAMESPACE_PARTS,
  CONTROLS_NAMESPACE,
} from '@/store/namespaces';
import { CONTROLS_ACTION_GET_VENDOR_EMAILS } from '@/store/modules/controls/action.types';
import { partKeyNames, historyKeyNames, rfqKeyNames } from '@/store/modules/rfq/key.names';
import { controlsKeyNames } from '@/store/modules/controls/key.names';
import { iconRoundedArrowsSprite, iconEmailSprite } from '@/assets/svg';
import { SvgSprite, Backdrop } from '@/components/gui';
import { DialogAddPartConverterUOM } from '@/components/common/index';

import RFQPartsTableHistoryMain from './TableHistoryMain';
import RFQTableHistoryILS from './TableHistoryILS';
// import TableHistoryRecentQuotes from './TableHistoryRecentQuotes';
import TableHistoryCatalog from './TableHistoryCatalog';
import TableHistorySites from './TableHistorySites';
import TableHistoryInventory from './TableHistoryInventory';
import TableHistoryAlt from './TableHistoryAlt';
import TableHistoryKits from './TableHistoryKits';
import TableHistoryConsignments from './TableHistoryConsignment';
import RFQPartsSendEmails from './SendEmails';

import newHistoryMixin from '../mixins/history-new.mixin';

export default {
  name: 'RFQPartsBlockHistory',
  mixins: [newHistoryMixin, Popper],
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-date-picker': DatePicker,
    'el-dialog': Dialog,
    'rfq-history-main': RFQPartsTableHistoryMain,
    'rfq-history-ils': RFQTableHistoryILS,
    // 'rfq-history-resq': TableHistoryRecentQuotes,
    'rfq-history-catalog': TableHistoryCatalog,
    'rfq-history-sites': TableHistorySites,
    'rfq-history-inventory': TableHistoryInventory,
    'rfq-history-alt': TableHistoryAlt,
    'rfq-history-kits': TableHistoryKits,
    'rfq-send-emails': RFQPartsSendEmails,
    'rfq-history-consignments': TableHistoryConsignments,
    'dialog-add-part-uom': DialogAddPartConverterUOM,
    SvgSprite,
    Backdrop,
  },
  beforeCreate() {
    this.dateFormat = config.dateFormat;
    this.partsKeys = partKeyNames;
    this.iconRoundedArrows = iconRoundedArrowsSprite;
    this.iconEmail = iconEmailSprite;
  },
  data() {
    return {
      showDialogAddPartConverterUom: false,
      dialogAddPartConverterUomPn: null,
      dialogAddPartConverterUomRates: [],
      dialogAddPartConverterUomMode: true,
      dialogAddPartConverterUomPart: null,

      filteredHistory: [],
      filterByVendor: null,
      filterByCondition: null,
      filterBySalesType: null,
      filterByDate: null,
      filterByQtyFrom: null,
      filterByQtyTo: null,
      showDialogSearchMarket: false,
      searchTypeSpiders: false,
      searchTypeILS: false,
      ilsSalesTypeFilter: [
        {
          label: this.translate.RFQ_LABEL_PART_HISTORY_ILS_TYPE_FILTER_STOCK,
          value: 'outright',
        },
        {
          label: this.translate.RFQ_LABEL_PART_HISTORY_ILS_TYPE_FILTER_REPAIR,
          value: 'repair',
        },
      ],
    };
  },
  props: {
    placement: {
      default: 'right-start',
    },
    translate: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS,
      [
        'getHistoryListVendors',
        'getPartProperty',
      ]),
    HISTORY_TYPE() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].HISTORY_TYPE;
    },
    attrParent() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PARENT,
      });
    },
    attrResponseDescription() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.DESCRIPTION,
      });
    },
    attrRfqId() {
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ID];
    },
    attrAvailableQty() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.QTY,
      });
    },
    attrReqQty() {
      return this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: historyKeyNames.QTY,
      });
    },
    attrResponsePartNumber() {
      return this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.PART_NUMBER,
      });
    },
    theRequestEmails() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].theRequestEmails;
    },
    visibleEmailsDialog() {
      return this.$store.state[RFQ_NAMESPACE].flags.showEmailsDialog;
    },
    currentHistoryTab() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyCurrentTab;
    },
    disabledFilterVendor() {
      return this.currentHistoryTab === this.HISTORY_TYPE.KITS || this.currentHistoryTab === this.HISTORY_TYPE.CONSIGNMENT;
    },
    disabledFilterCondition() {
      return (
        this.currentHistoryTab === this.HISTORY_TYPE.KITS
        || this.currentHistoryTab === this.HISTORY_TYPE.ALTERNATIVE
      );
    },
    disabledFilterSalesType() {
      return (
        this.currentHistoryTab === this.HISTORY_TYPE.KITS
        || this.currentHistoryTab === this.HISTORY_TYPE.ALTERNATIVE
        || this.currentHistoryTab === this.HISTORY_TYPE.INVENTORY
        || this.currentHistoryTab === this.HISTORY_TYPE.CATALOG
        || this.currentHistoryTab === this.HISTORY_TYPE.CONSIGNMENT
      );
    },
    disabledFilterQty() {
      return (
        this.currentHistoryTab === this.HISTORY_TYPE.KITS
        || this.currentHistoryTab === this.HISTORY_TYPE.ALTERNATIVE
      );
    },
    disabledFilterDate() {
      return (
        this.currentHistoryTab === this.HISTORY_TYPE.KITS
        || this.currentHistoryTab === this.HISTORY_TYPE.ALTERNATIVE
        || this.currentHistoryTab === this.HISTORY_TYPE.INVENTORY
        || this.currentHistoryTab === this.HISTORY_TYPE.CONSIGNMENT
      );
    },
    historyList() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory;
    },
    originalHistory() {
      const history = this.historyList[this.historyPartNumber];
      if (history !== undefined) {
        if ((this.currentHistoryTab === this.HISTORY_TYPE.ILSv2)) {
          const ilsHistory = (history[this.currentHistoryTab] && history[this.currentHistoryTab] !== '[]') ? JSON.parse(history[this.currentHistoryTab]) : null;
          const marketHistory = history.market ? JSON.parse(history.market) : null;
          const resultHistory = ilsHistory ? ilsHistory.concat(marketHistory) : (marketHistory || null);
          return resultHistory;
        }
        return JSON.parse(history[this.currentHistoryTab]);
      }
      return null;
    },
    historyToDisplay() {
      if (!this.originalHistory) {
        return [];
      }
      if (this.isFilter) {
        return (this.filteredHistory.length > 0) ? this.filteredHistory : [];
      }
      return this.originalHistory;
    },
    isFilter() {
      return (
        !!this.filterByVendor
        || !!this.filterByCondition
        || !!this.filterBySalesType
        || !!this.filterByDate
        || !!this.filterByQtyFrom
        || !!this.filterByQtyTo
      );
    },
    historyPartNumber() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyPartNumber;
    },
    attrHistoryId() {
      return this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.HISTORY_ID,
      });
    },
    selectVendors() {
      if (this.currentHistoryTab === this.HISTORY_TYPE.KITS || this.currentHistoryTab === this.HISTORY_TYPE.CONSIGNMENT) {
        return null;
      }
      return this.getHistoryListVendors(this.historyPartNumber, this.currentHistoryTab);
    },
    socketReady() {
      return this.$store.getters.socketReady;
    },
    isRequestChanged() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].list.some(item => this.getPartProperty({
        type: partKeyNames.FLAGS,
        name: partKeyNames.FLAG_CHANGED_REQUEST,
        target: item,
      }));
    },
    ...mapState(CONTROLS_NAMESPACE, {
      selectCondition: state => state.static[controlsKeyNames.PN_CONDITION],
      selectSalesType: state => state[controlsKeyNames.SALES_TYPE],
    }),
    searchMarketLoading() {
      return this.$store.state[RFQ_NAMESPACE].loading.searchMarket;
    },
    isILS() {
      if (this.currentHistoryTab === this.HISTORY_TYPE.ILS || this.currentHistoryTab === this.HISTORY_TYPE.ILSv2) {
        return true;
      }
      return false;
    },
    lengthCatalog() {
      if (!this.historyPartNumber || this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber] === undefined) {
        return false;
      }
      const catalog = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber][this.HISTORY_TYPE.CATALOG];
      if (JSON.parse(catalog)) {
        if (JSON.parse(catalog).length > 0) {
          return true;
        }
      }
      return false;
    },
    lengthInventory() {
      if (!this.historyPartNumber || this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber] === undefined) {
        return false;
      }
      const inventory = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber][this.HISTORY_TYPE.INVENTORY];
      if (JSON.parse(inventory)) {
        if (JSON.parse(inventory).length > 0) {
          return true;
        }
      }
      return false;
    },
    lengthAlternative() {
      if (!this.historyPartNumber || this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber] === undefined) {
        return false;
      }
      const alternative = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber][this.HISTORY_TYPE.ALTERNATIVE];
      if (JSON.parse(alternative)) {
        if (JSON.parse(alternative).length > 0) {
          return true;
        }
      }
      return false;
    },
    lengthConsignment() {
      if (!this.historyPartNumber || this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber] === undefined) {
        return false;
      }
      const consignment = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[this.historyPartNumber][this.HISTORY_TYPE.CONSIGNMENT];
      if (JSON.parse(consignment)) {
        if (JSON.parse(consignment).length > 0) {
          return true;
        }
      }
      return false;
    },
    // selectSalesTypeFilter() {
    //   if (this.currentHistoryTab === this.HISTORY_TYPE.ILS || this.currentHistoryTab === this.HISTORY_TYPE.ILSv2) {
    //     console.log(this.ilsSalesTypeFilter);
    //     return this.ilsSalesTypeFilter;
    //   }
    //   return this.selectSalesType;
    // },
    attrRequestPartNumber() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PART_NUMBER,
      });
    },
    attrBaseUom() {
      let attrBaseUom;
      if (this.$store.state[RFQ_NAMESPACE].partsUom[this.attrRequestPartNumber]) {
        attrBaseUom = this.$store.state[RFQ_NAMESPACE].partsUom[`${this.attrRequestPartNumber}`];
      }
      if (!this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].selectedPart.request) {
        attrBaseUom = this.$store.state[RFQ_NAMESPACE].partsUom[`${this.attrResponsePartNumber}`];
      }
      return attrBaseUom || { base_uom: null, uom: [] };
    },
  },
  watch: {
    socketReady() {
      if (this.historyPartNumber !== null) {
        this.getHistory(this.HISTORY_TYPE.MAIN);
        this.getHistory(this.HISTORY_TYPE.CATALOG, true);
        this.getHistory(this.HISTORY_TYPE.INVENTORY, true);
        this.getHistory(this.HISTORY_TYPE.ALTERNATIVE, true);
        this.getHistory(this.HISTORY_TYPE.CONSIGNMENT, true);
      }
    },
    historyPartNumber: {
      handler(newVal, oldVal) {
        if (!!newVal && newVal !== oldVal) {
          this.clearFilters();
          this.clearFilteredHistory();
          this.getHistory(this.currentHistoryTab);
          this.getHistory(this.HISTORY_TYPE.CATALOG, true);
          this.getHistory(this.HISTORY_TYPE.INVENTORY, true);
          this.getHistory(this.HISTORY_TYPE.ALTERNATIVE, true);
          this.getHistory(this.HISTORY_TYPE.CONSIGNMENT, true);
        }
        if (this.currentHistoryTab === this.HISTORY_TYPE.ILS || this.currentHistoryTab === this.HISTORY_TYPE.ILSv2) {
          this.filterBySalesType = this.selectSalesType[0].value;
        }
      },
      immediate: true,
    },
    isFilter(newVal) {
      if (!newVal) this.clearFilteredHistory();
    },
    attrResponseDescription() {
      if (this.historyList[this.historyPartNumber] !== undefined) {
        if (this.historyList[this.historyPartNumber][this.HISTORY_TYPE.ALTERNATIVE] !== null) {
          this[RFQ_PARTS_DEL_HISTORY]({
            partNumber: this.historyPartNumber,
            type: this.HISTORY_TYPE.ALTERNATIVE,
          });
        }
      }

      if (this.currentHistoryTab === this.HISTORY_TYPE.ALTERNATIVE) {
        this.getHistory(this.HISTORY_TYPE.ALTERNATIVE);
      }
    },
    visibleEmailsDialog(value) {
      this.showPopper = value;
    },
    currentHistoryTab(newVal) {
      this.clearFilteredHistory();
      this.clearFilters();
      if (newVal === this.HISTORY_TYPE.ILS || newVal === this.HISTORY_TYPE.ILSv2) {
        this.filterBySalesType = this.selectSalesType[0].value;
      }
    },
    originalHistory(newVal) {
      if (this.isFilter && newVal !== null) {
        this.filterHistory();
      }
    },
  },
  methods: {
    getHistory(historyType, justLoad) {
      if (!justLoad) {
        this[RFQ_RATS_SET_HISTORY_TAB](historyType);
      }
      const queryObj = {
        params: {
          rpn: this.historyPartNumber,
          filter: {
            type: historyType,
          },
        },
      };
      const manuallyObj = {
        params: {
          rpn: this.historyPartNumber,
          filter: {
            type: this.HISTORY_TYPE.MAIN,
          },
        },
      };

      if (
        Array.isArray(this.originalHistory)
        && (historyType !== this.HISTORY_TYPE.ILS)
        && (historyType !== this.HISTORY_TYPE.ILSv2)
      ) {
        return;
      }

      switch (historyType) {
        case this.HISTORY_TYPE.CATALOG:
          this[RFQ_PARTS_ACTION_GET_HISTORY_CATALOG](queryObj);
          break;
        case this.HISTORY_TYPE.INVENTORY:
          this[RFQ_PARTS_ACTION_GET_HISTORY_INVENTORY](queryObj);
          break;
        case this.HISTORY_TYPE.ALTERNATIVE:
          queryObj.params.description = this.attrResponseDescription;
          this[RFQ_PARTS_ACTION_GET_HISTORY_ALTERNATIVE](queryObj);
          break;
        case this.HISTORY_TYPE.KITS:
          this[RFQ_PARTS_ACTION_GET_HISTORY_KITS](queryObj);
          break;
        case this.HISTORY_TYPE.CONSIGNMENT:
          this[RFQ_PARTS_ACTION_GET_HISTORY_CONSIGNMENT](queryObj);
          break;
        case this.HISTORY_TYPE.ILS:
          this[RFQ_PARTS_ACTION_GET_HISTORY](queryObj);
          this[RFQ_PARTS_ACTION_GET_HISTORY](manuallyObj);
          break;
        case this.HISTORY_TYPE.ILSv2:
          // load market part base
          this[RFQ_SET_LOADING_FLAG]({
            name: 'marketHistory',
            value: true,
          });
          const queryPartBaseObj = JSON.parse(JSON.stringify(queryObj));
          queryPartBaseObj.params.filter.type = this.HISTORY_TYPE.MARKET;
          this[RFQ_PARTS_ACTION_GET_HISTORY](queryPartBaseObj);
          // load ils
          this[RFQ_SET_LOADING_FLAG]({
            name: 'ilsHistory',
            value: true,
          });
          this[RFQ_PARTS_ACTION_GET_HISTORY](queryObj);
          // load history
          this[RFQ_PARTS_ACTION_GET_HISTORY](manuallyObj);
          break;
        default:
          this[RFQ_PARTS_ACTION_GET_HISTORY](queryObj);
          break;
      }
    },
    filterHistory() {
      if (!this.isFilter) return;

      this.clearFilteredHistory();

      for (let i = 0; i < this.originalHistory.length; i += 1) {
        const vendorCode = this.originalHistory[i][historyKeyNames.VENDOR][historyKeyNames.VENDOR_CODE] || null;
        const condition = this.originalHistory[i][historyKeyNames.PN_CONDITION] || null;
        const salesType = this.originalHistory[i][historyKeyNames.SALES_TYPE] || null;
        const date = this.originalHistory[i][historyKeyNames.DATE] || null;
        const qty = this.originalHistory[i][historyKeyNames.QTY] || this.originalHistory[i][historyKeyNames.MOQ] || null;
        const vendorMatch = (this.filterByVendor !== null && vendorCode) ? vendorCode === this.filterByVendor : false;
        const conditionMatch = (this.filterByCondition !== null && condition) ? condition === this.filterByCondition : false;
        const salesTypeMatch = (this.filterBySalesType !== null && salesType) ? salesType === this.filterBySalesType : false;
        const fromDateMatch = (this.filterByDate !== null && date) ? (date >= this.filterByDate[0]) : false;
        const toDateMatch = (this.filterByDate !== null && date) ? (date <= this.filterByDate[1]) : false;
        const fromQtyMatch = (this.filterByQtyFrom !== null && qty) ? (+qty >= +this.filterByQtyFrom) : false;
        const toQtyMatch = (this.filterByQtyTo !== null && qty) ? (+qty <= +this.filterByQtyTo) : false;

        if (
          (vendorMatch || !this.filterByVendor)
          && (conditionMatch || !this.filterByCondition)
          && (salesTypeMatch || !this.filterBySalesType)
          && (fromDateMatch || !this.filterByDate)
          && (toDateMatch || !this.filterByDate)
          && (fromQtyMatch || !this.filterByQtyFrom || this.filterByQtyFrom === '')
          && (toQtyMatch || !this.filterByQtyTo || this.filterByQtyTo === '')
        ) {
          this.filteredHistory.push(this.originalHistory[i]);
        }
      }
    },
    clearFilters() {
      this.filterByVendor = null;
      this.filterByCondition = null;
      this.filterBySalesType = null;
      this.filterByDate = null;
    },
    clearFilteredHistory() {
      this.filteredHistory = [];
    },
    handleAddUOM(uom) {
      this.dialogAddPartConverterUomPn = {
        name: this.attrResponsePartNumber,
        id: this.attrBaseUom.productid,
      };
      this.dialogAddPartConverterUomPart = {
        name: this.attrResponsePartNumber,
        id: this.attrBaseUom.productid,
      };
      this.dialogAddPartConverterUomRates = [
        {
          from_uom: uom,
          to_uom: this.attrBaseUom.base_uom,
        },
      ];
      this.showDialogAddPartConverterUom = true;
    },
    closeDialogAddPartUom(pn, part) {
      this.showDialogAddPartConverterUom = false;
      this[RFQ_ACTION_GET_PART_INFO](pn.name);
    },
    handleHistorySelect(history, type) {
      switch (type) {
        case this.HISTORY_TYPE.MAIN:
          if (!this.attrBaseUom.uom.find(uom => uom.from_uom === history.uom)) {
            this.handleAddUOM(history.uom);
            return;
          }
          this[RFQ_PARTS_SET_DATA_FROM_HISTORY](history);
          this[RFQ_PARTS_SET_PART_CURRENT_UOM](this.attrBaseUom.uom.find(uom => uom.from_uom === history.uom));
          break;
        case this.HISTORY_TYPE.CATALOG:
         let obj = {
            qty_avail: this.$store.state.auth.configCompany.rfq.qty_avail,
            catalog: history
         }
          this[RFQ_PARTS_SET_DATA_FROM_HISTORY_CATALOG](obj);
          this[RFQ_PARTS_SET_PART_HISTORY_PROPERTY]({ name: historyKeyNames.HISTORY_ID, value: null });
          this.setFlagNewHistoryMixin();
          break;
        case this.HISTORY_TYPE.INVENTORY:
          if (!this.attrBaseUom.uom.find(uom => uom.from_uom === history.usageunit)) {
            this.handleAddUOM(history.usageunit);
            return;
          }
          this[RFQ_PARTS_SET_DATA_FROM_HISTORY_INVENTORY](history);
          this[RFQ_PARTS_SET_PART_HISTORY_PROPERTY]({ name: historyKeyNames.HISTORY_ID, value: null });
          const currentUomInventory = this.attrBaseUom.uom.find(uom => uom.from_uom === history.usageunit);
          currentUomInventory.multiplier = history.multiplier;
          currentUomInventory.divider = history.divider;
          this[RFQ_PARTS_SET_PART_CURRENT_UOM](currentUomInventory);
          this.setFlagNewHistoryMixin();
          break;
        case this.HISTORY_TYPE.CONSIGNMENT:
          if (!this.attrBaseUom.uom.find(uom => uom.from_uom === history.usageunit)) {
            this.handleAddUOM(history.usageunit);
            return;
          }
          this[RFQ_PARTS_SET_DATA_FROM_HISTORY_CONSIGNMENT](history);
          this[RFQ_PARTS_SET_PART_HISTORY_PROPERTY]({ name: historyKeyNames.HISTORY_ID, value: null });
          this[RFQ_PARTS_SET_PART_CURRENT_UOM](this.attrBaseUom.uom.find(uom => uom.from_uom === history.usageunit));
          this.setFlagNewHistoryMixin();
          break;
        case this.HISTORY_TYPE.KITS:
          break;
        default: // ILS, ILSv2, RECENT, SITES
          this[RFQ_PARTS_SET_DATA_FROM_HISTORY](history);
          this[RFQ_PARTS_SET_PART_HISTORY_PROPERTY]({ name: historyKeyNames.HISTORY_ID, value: null });
          this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_DELIVERY_TIME, value: true });
          this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_CURRENT_LINE_OFFERED, value: true });
          if (history.salestype === this.selectSalesType[1].value) {
            this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_VENDOR_RETURN_DAYS, value: true });
          }
          this.setFlagNewHistoryMixin();
          break;
      }

      if (+history.hid === +this.attrHistoryId && type !== 'ils') {
        this[RFQ_PARTS_SET_FROM_SNAPSHOT]({ name: partKeyNames.RESPONSE });
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_RECALCULATE_OFFER, value: false });
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_CURRENT_LINE_OFFERED, value: false });
        return;
      }
      const reqQty = this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.QTY,
      }) || 1;
      const validQty = +history.qty < +reqQty ? +history.qty : +reqQty;
      this[RFQ_PARTS_SET_PART_PROPERTY]([
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: validQty,
        },
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: validQty,
        },
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: validQty,
        },
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.QTY,
          value: validQty,
        },
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: validQty,
        },
      ]);

      // calculate converted prices
      this[RFQ_PARTS_SET_CONVERTED_VALUES]({ target: history, mode: 'history' });
      this[RFQ_PARTS_SET_PART_PROPERTY]([
        {
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_MOQ,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: history[historyKeyNames.OFFER_BY_SALES_TYPE][partKeyNames.SALE_OUTRIGHT_VENDOR_MOQ],
        },
      ]);

      this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_CURRENT_LINE_OFFERED, value: true });
      if (history.salestype === this.selectSalesType[1].value) {
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_VENDOR_RETURN_DAYS, value: true });
      }
      this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_DELIVERY_TIME, value: true });
    },
    toggleEmailsDialog() {
      this[RFQ_SET_FLAG]({ name: 'showEmailsDialog', value: !this.visibleEmailsDialog });
    },
    handleSearchMarket({ cache = 1 }) {
      if (!this.attrRfqId || this.isRequestChanged) {
        this.$notify({
          type: 'error',
          title: this.translate.RFQ_TITLE_NOTIFY_MARKET_SEARCH_ERROR,
          message: this.translate.RFQ_TEXT_NOTIFY_MARKET_SEARCH_RFQ_ERROR,
          duration: config.notificationErrorDuration,
        });
        return;
      }
      if (this.searchMarketLoading) {
        this.$notify({
          type: 'warning',
          title: this.translate.RFQ_TITLE_NOTIFY_MARKET_SEARCH_WARN,
          message: this.translate.RFQ_TEXT_NOTIFY_MARKET_SEARCH_WARN,
          duration: config.notificationErrorDuration,
        });
        return;
      }
      this.searchTypeSpiders = !!cache;
      this.searchTypeILS = !cache;
      this.toggleSearchMarketDialog();
      this[RFQ_SET_LOADING_FLAG]({
        name: 'searchMarket',
        value: true,
      });
      this.$socket.sendObj({
        path: '/v1/rfq/market',
        params: {
          rpn: this.attrResponsePartNumber,
          qty: this.attrReqQty,
          rfq_id: this.attrRfqId,
          cache,
        },
        data: {
          response: {
            client: 'vue',
            options: {
              namespace: RFQ_COMBO_NAMESPACE_PARTS,
              action: RFQ_PARTS_ACTION_SPIDERS_TIMER,
            },
          },
        },
      });
    },
    toggleSearchMarketDialog() {
      this.showDialogSearchMarket = !this.showDialogSearchMarket;
    },
    ...mapActions(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_ACTION_GET_HISTORY,
        RFQ_PARTS_ACTION_GET_HISTORY_CATALOG,
        RFQ_PARTS_ACTION_GET_HISTORY_INVENTORY,
        RFQ_PARTS_ACTION_GET_HISTORY_ALTERNATIVE,
        RFQ_PARTS_ACTION_GET_HISTORY_KITS,
        RFQ_PARTS_ACTION_GET_HISTORY_CONSIGNMENT,
      ]),
    ...mapActions(RFQ_NAMESPACE, [
      RFQ_ACTION_GET_PART_INFO,
    ]),
    ...mapActions(CONTROLS_NAMESPACE, [
      CONTROLS_ACTION_GET_VENDOR_EMAILS,
    ]),
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_SET_PART_PROPERTY,
        RFQ_PARTS_SET_DATA_FROM_HISTORY,
        RFQ_PARTS_SET_PART_HISTORY_PROPERTY,
        RFQ_PARTS_SET_DATA_FROM_HISTORY_INVENTORY,
        RFQ_PARTS_SET_DATA_FROM_HISTORY_CONSIGNMENT,
        RFQ_RATS_SET_HISTORY_TAB,
        RFQ_PARTS_SET_DATA_FROM_HISTORY_CATALOG,
        RFQ_PARTS_DEL_HISTORY,
        RFQ_PARTS_SET_FROM_SNAPSHOT,
        RFQ_PARTS_SET_FLAG,
        RFQ_PARTS_SET_CONVERTED_VALUES,
      ]),
    ...mapMutations(RFQ_NAMESPACE,
      [
        RFQ_SET_FLAG,
        RFQ_SET_LOADING_FLAG,
        RFQ_PARTS_SET_PART_CURRENT_UOM,
      ]),
  },
  mounted() {
    this.popperElm = this.$refs.popper.$el;
  },
};
</script>
