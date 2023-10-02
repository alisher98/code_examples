import { isEqual } from 'lodash';
import { mapGetters } from 'vuex';
import { getNS } from '@/store';
import { RFQ_PARTS_SET_FLAG_NEED_TO_SAVE_NEW_HISTORY, RFQ_PARTS_DELETE_FLAG_NEED_TO_SAVE_NEW_HISTORY } from '@/store/modules/rfq/mutation.types';
import { RFQ_COMBO_NAMESPACE_PARTS, RFQ_NAMESPACE, RFQ_NAMESPACE_PARTS } from '@/store/namespaces';
import { partKeyNames, historyKeyNames } from '@/store/modules/rfq/key.names';

export default {
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS, [
      'getPartProperty',
    ]),
    ROUNDING_MIX() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].ROUNDING;
    },
    isHistoryChangedMixin() {
      return this.getPartProperty({
        type: partKeyNames.FLAGS,
        name: partKeyNames.FLAG_CHANGED_HISTORY,
      });
    },
  },
  methods: {
    setFlagNewHistoryMixin() {
      if (this.isHistoryChangedMixin) return;
      this.$store.commit(getNS([RFQ_COMBO_NAMESPACE_PARTS, RFQ_PARTS_SET_FLAG_NEED_TO_SAVE_NEW_HISTORY]));
    },
    deleteFlagNewHistoryMixin(hid) {
      if (!this.isHistoryChangedMixin) return;
      this.$store.commit(getNS([RFQ_COMBO_NAMESPACE_PARTS, RFQ_PARTS_DELETE_FLAG_NEED_TO_SAVE_NEW_HISTORY]), { hid });
    },
    comparisonWithHistory(attr, newValue) {
      if (newValue === '0' || newValue === 0) {
        if (attr === 'attrAvailableQty' || attr === 'attrVendorMoq') {
          return;
        }
      }
      this[attr] = newValue;
      const currentHistoryId = this.getPartProperty({ type: partKeyNames.HISTORY, name: historyKeyNames.HISTORY_ID });
      if (this.checkForEqualityHistory() === true) {
        this.deleteFlagNewHistoryMixin(currentHistoryId);
      } else {
        this.setFlagNewHistoryMixin();
      }
    },
    checkForEqualityHistory() {
      const pn = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyPartNumber;
      const tab = this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyCurrentTab;
      const currentHistoryId = this.getPartProperty({ type: partKeyNames.HISTORY, name: historyKeyNames.HISTORY_ID });
      if (currentHistoryId === null) {
        return;
      }
      const dataHistory = JSON.parse(this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataHistory[pn][tab]).filter(line => line.hid === currentHistoryId)[0];
      const currentHistory = JSON.parse(JSON.stringify(this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].selectedPart.history));
      // edit dataHistory obj
      dataHistory.price = String(dataHistory.price.toFixed(this.ROUNDING_MIX.PRICES));
      dataHistory.no_quote = dataHistory.nq;
      delete dataHistory.json_data;
      delete dataHistory.created_time;
      delete dataHistory.modified_time;
      delete dataHistory.nq;
      delete dataHistory.found_date;
      delete dataHistory.user;
      Object.keys(dataHistory.tags).forEach((value) => {
        if (typeof dataHistory.tags[value] === 'string') {
          dataHistory.tags[value] = dataHistory.tags[value].toUpperCase();
        }
      });
      Object.keys(dataHistory.hazmat).forEach((value) => {
        if (value !== 'is_hazmat') {
          delete dataHistory.hazmat[value];
        }
      });
      delete dataHistory.special_info;


      // edit current history obj
      currentHistory.no_quote = currentHistory.nq;
      currentHistory.qty = +currentHistory.qty;
      delete currentHistory.user;
      delete currentHistory.nq;
      delete currentHistory.json_data;
      delete currentHistory.created_time;
      delete currentHistory.modified_time;
      delete currentHistory.found_date;

      Object.keys(currentHistory.tags).forEach((value) => {
        if (typeof currentHistory.tags[value] === 'string') {
          currentHistory.tags[value] = currentHistory.tags[value].toUpperCase();
        }
      });
      Object.keys(currentHistory.hazmat).forEach((value) => {
        if (value !== 'is_hazmat') {
          delete currentHistory.hazmat[value];
        }
      });
      delete currentHistory.special_info;
      switch (dataHistory.salestype) {
        case 'outright':
          currentHistory.vendor_moq = +currentHistory.offer_data.outright_vendor_moq;
          delete currentHistory.offer_data;
          dataHistory.vendor_moq = +dataHistory.offer_data.outright_vendor_moq;
          delete dataHistory.offer_data;
          break;
        case 'exchange':
          if (dataHistory.offer_data.exchange_flat_exchange === null) {
            dataHistory.offer_data.exchange_flat_exchange = false;
          }
          if (currentHistory.offer_data.exchange_flat_exchange === null) {
            currentHistory.offer_data.exchange_flat_exchange = false;
          }
          if (currentHistory.offer_data.exchange_ber_cost === '0.0000') {
            currentHistory.offer_data.exchange_ber_cost = null;
          }
          if (dataHistory.offer_data.exchange_ber_cost === '0.0000') {
            dataHistory.offer_data.exchange_ber_cost = null;
          }
          if (currentHistory.offer_data.exchange_vendor_rtrn_days === '') {
            currentHistory.offer_data.exchange_vendor_rtrn_days = null;
          }
          break;
        default:
          break;
      }
      if (typeof currentHistory.price === 'number') {
        currentHistory.price = String(currentHistory.price.toFixed(this.ROUNDING_MIX.PRICES));
      }
      if (currentHistory.notes === '') {
        currentHistory.notes = null;
      }
      if (currentHistory.non_notes === '') {
        currentHistory.non_notes = null;
      }

      if (isEqual(dataHistory, currentHistory)) {
        return true;
      }
      return false;
    },
  },
};
