import { RFQ_NAMESPACE, RFQ_NAMESPACE_PARTS, AUTH_NAMESPACE } from '@/store/namespaces';
import { rfqKeyNames } from '@/store/modules/rfq/key.names';

export default {
  computed: {
    loadingMixin() {
      if (!this.partsListLength) {
        return false;
      }
      if (this.currentTab === 'catalog') {
        return this.$store.state[RFQ_NAMESPACE].loading.catalogHistory;
      }
      if (this.currentTab === 'inventory') {
        return this.$store.state[RFQ_NAMESPACE].loading.inventoryHistory;
      }
      if (this.currentTab === 'ilsV2') {
        return this.$store.state[RFQ_NAMESPACE].loading.ilsHistory;
      }
      if (this.currentTab === 'alternative') {
        return this.$store.state[RFQ_NAMESPACE].loading.alternativeHistory;
      }
      if (this.currentTab === 'consignment') {
        return this.$store.state[RFQ_NAMESPACE].loading.consignmentHistory;
      }
      return this.$store.state[RFQ_NAMESPACE].loading.history;
    },
    partsListLength() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].list.length;
    },
    currentTab() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyCurrentTab;
    },
    currencySymbol() {
      if (!this.$store.state[AUTH_NAMESPACE].configCompany.currency) {
        return null;
      }
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency.currency_symbol;
    },
    companyCurrency() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency;
    },
  },
  methods: {
    handleRowClickMixin(row, ev) {
      if (ev.target.hasAttribute('exclude-row-click')) return;
      this.$emit('row-click', row);
    },
  },
};
