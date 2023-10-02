import { mapMutations } from 'vuex';
import {
  RFQ_NAMESPACE,
  RFQ_NAMESPACE_PARTS,
  RFQ_COMBO_NAMESPACE_PARTS,
  AUTH_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_PARTS_SET_FLAG,
  RFQ_PARTS_SET_PART_PROPERTY,
} from '@/store/modules/rfq/mutation.types';
import { partKeyNames, historyKeyNames, rfqKeyNames } from '@/store/modules/rfq/key.names';
import { saleTypes } from '@/store/modules/controls/controls.store';
import newHistoryMixin from './history-new.mixin';
import rateMixin from './rate.mixin';

export const offerMixin = {
  mixins: [newHistoryMixin, rateMixin],
  data() {
    return {
      mainPriceDirectChangeMixin: false,
      mainCostDirectChangeMixin: false,
    };
  },
  computed: {
    ROUNDING_MIX() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].ROUNDING;
    },
    companyRate() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.rfq.calculation.type;
    },
    flagSetDeliveryTimeMixin: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.FLAGS,
          name: partKeyNames.FLAG_SET_DELIVERY_TIME,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_DELIVERY_TIME, value });
      },
    },
    flagSetVendorReturnDaysMixin: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.FLAGS,
          name: partKeyNames.FLAG_SET_VENDOR_RETURN_DAYS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_SET_VENDOR_RETURN_DAYS, value });
      },
    },
    flagCurrentLineOfferedMixin: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.FLAGS,
          name: partKeyNames.FLAG_CURRENT_LINE_OFFERED,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_CURRENT_LINE_OFFERED, value });
      },
    },
    historyCurrencyMixin() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.CURRENCY,
      }) || {};
    },
    rfqCurrencyMixin() {
      if (!this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY]) {
        return {};
      }
      return this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY];
    },
    companyCurrency() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency;
    },
    currencyHistoryComparisonMixin() {
      if (!this.historyCurrencyMixin.currency_id || !this.companyCurrency.currency_id) {
        return false;
      }
      return this.historyCurrencyMixin.currency_id !== this.companyCurrency.currency_id;
    },
    currencyRfqComparisonMixin() {
      if (!this.rfqCurrencyMixin.currency_id || !this.companyCurrency.currency_id) {
        return false;
      }
      return this.rfqCurrencyMixin.currency_id !== this.companyCurrency.currency_id;
    },
    attrRequestPartNumber() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PART_NUMBER,
      });
    },
    attrRequestUomMixin() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.UOM,
      });
    },
    requestUomParamsMixin() {
      if (!this.attrBaseUom.uom.length) {
        return { multiplier: 1, divider: 1 };
      }
      return this.attrBaseUom.uom.find(uom => uom.from_uom === this.attrRequestUomMixin) || { multiplier: 1, divider: 1 };
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
    partUomParamsMixin() {
      if (!this.$store.state[RFQ_NAMESPACE].currentPartUom.from_uom) {
        return { multiplier: 1, divider: 1 };
      }
      return this.$store.state[RFQ_NAMESPACE].currentPartUom;
    },
  },
  watch: {
    rfqCurrencyMixin: {
      handler() {
        this.updateConvertedPrices();
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS, [
      RFQ_PARTS_SET_FLAG,
      RFQ_PARTS_SET_PART_PROPERTY,
    ]),
    updateConvertedCostsMixin(value) {
      const price = +this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.PRICE,
      }) || 0;
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.PRICE_CONVERTED,
        value: price / value.entity_rate,
      });

      const rate = +this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.RATE,
      }) || 1;

      if (this.attrSalesType === saleTypes[0].value) {
        const vendor = this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.VENDOR,
        });

        if (vendor.currency) {
          const vendorMinOrder = vendor.vendor_min_order_sum ? vendor.vendor_min_order_sum : vendor.min_order_sum;
          this[RFQ_PARTS_SET_PART_PROPERTY]({
            type: partKeyNames.HISTORY,
            name: historyKeyNames.VENDOR_MINIMUM_ORDER,
            path: historyKeyNames.VENDOR,
            value: +((vendorMinOrder * value.entity_rate) / vendor.currency.currency_rate),
          });
        }

        // calculate response part
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_UNIT_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((price / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
      } else if (this.attrSalesType === saleTypes[1].value) {
        // exhcange sales type
        // ber cost
        const berCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value: berCost / value.entity_rate,
        });
        // service cost
        const serviceCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value: serviceCost / value.entity_rate,
        });
        // response
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((price / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((serviceCost / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((berCost / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
      } else {
        // repair sales type
        // bCheckCost
        const bCheckCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_B_CHECK_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_B_CHECK_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value: bCheckCost / value.entity_rate,
        });

        // max repair cost
        const maxRepairCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value: maxRepairCost / value.entity_rate,
        });

        // response
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_AVG_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((price / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_B_CHECK_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((bCheckCost / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((maxRepairCost / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate,
        });
      }
    },
    updateConvertedPrices() {
      if (this.attrSalesTypeMixin === saleTypes[0].value) {
        // if sales type Outright
        const price = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_UNIT_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_UNIT_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (price * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });
      } else if (this.attrSalesTypeMixin === saleTypes[1].value) {
        // if sales type Exchange

        // ex. fee price
        const price = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (price * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });

        // ber price
        const berPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (berPrice * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });

        // service price
        const servicePrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (servicePrice * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });
      } else {
        // if sales type Repair

        // b check price
        const price = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_B_CHECK_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_B_CHECK_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (price * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });

        // avg repair price
        const avgRepairPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_AVG_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_AVG_REPAIR_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (avgRepairPrice * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });

        // max repair price
        const maxRepairPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: (maxRepairPrice * this.companyCurrency.currency_rate) / this.rfqCurrencyMixin.entity_rate,
        });
      }
    },
    updateRatePriceMixin(rfqRate, historyRate) {
      const rate = +this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.RATE,
      }) || 1;
      const price = +this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.PRICE,
      }) || 0;
      if (this.attrSalesTypeMixin === saleTypes[0].value) { // outright
        const convertedPrice = ((+price * this.companyCurrency.currency_rate) / historyRate).toFixed(this.ROUNDING_MIX.PRICES);
        const convertedPriceUOM = (convertedPrice * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier;
        const resultPrice = ((((convertedPriceUOM / +rate) * rfqRate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider);
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_UNIT_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          // value: ((((price / rate) * rfqRate) / historyRate) * this.partUomParamsMixin.multiplier) / this.partUomParamsMixin.divider,
          value: resultPrice.toFixed(this.ROUNDING_MIX.PRICES),
        });
      } else if (this.attrSalesTypeMixin === saleTypes[1].value) { // exchange
        const berCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        const serviceCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;

        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((price / rate) * rfqRate) / historyRate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((serviceCost / rate) * rfqRate) / historyRate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((berCost / rate) * rfqRate) / historyRate,
        });
      } else { // repair
        const bCheckCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_B_CHECK_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        const maxRepairCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;

        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_AVG_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((price / rate) * rfqRate) / historyRate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_B_CHECK_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((bCheckCost / rate) * rfqRate) / historyRate,
        });
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_REPAIR_MAX_REPAIR_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: ((maxRepairCost / rate) * rfqRate) / historyRate,
        });
      }
      this.updateConvertedPrices();
    },
    calculatePriceUOMOutrightMixin(cost, rate) {
      // const costConvert = (((+cost * this.companyCurrency.currency_rate) / this.historyCurrencyMixin.entity_rate) * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier;
      // const result = (((costConvert / +rate) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
      const result = (((cost / +rate) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
      return result.toFixed(this.ROUNDING_MIX.PRICES);
    },
    calculatePriceConvertedUOMOutrightMixin(cost, rate) {
      return ((((+cost * this.companyCurrency.currency_rate) / this.historyCurrencyMixin.entity_rate) * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier) / +rate;
    },
    calculatePriceOutrightMixin(cost, rate) {
      const convertedCost = ((cost / this.historyCurrencyMixin.entity_rate) / this.partUomParamsMixin.multiplier) * this.partUomParamsMixin.divider;
      let result;
      switch (this.companyRate) {
        case 'rate':
          result = (((convertedCost / +rate) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
          break;
        case 'margin':
          result = ((((convertedCost / +rate) * 100) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
          break;
        case 'markup':
          result = ((((convertedCost / 100) * +rate) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
          break;
        default:
          result = (((convertedCost / +rate) * this.rfqCurrencyMixin.entity_rate) * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
          break;
      }
      return result.toFixed(this.ROUNDING_MIX.PRICES);
    },
    calculatePriceMixin(cost, rate) {
      let result;
      switch (this.companyRate) {
        case 'rate':
          result = (((+cost * this.rfqCurrencyMixin.entity_rate) / this.historyCurrencyMixin.entity_rate) / +rate).toFixed(this.ROUNDING_MIX.PRICES);
          break;
        case 'margin':
          result = ((((+cost * this.rfqCurrencyMixin.entity_rate) / this.historyCurrencyMixin.entity_rate) / +rate) * 100).toFixed(this.ROUNDING_MIX.PRICES);
          break;
        case 'markup':
          result = ((((+cost * this.rfqCurrencyMixin.entity_rate) / this.historyCurrencyMixin.entity_rate) / 100) * +rate).toFixed(this.ROUNDING_MIX.PRICES);
          break;
        default:
          result = (((+cost * this.rfqCurrencyMixin.entity_rate) / this.historyCurrencyMixin.entity_rate) / +rate).toFixed(this.ROUNDING_MIX.PRICES);
          break;
      }
      return result;
    },
    calculateMgmBenefitMixin(totalPrice, totalCost) {
      if (!totalPrice || !totalCost) {
        return (0).toFixed(this.ROUNDING_MIX.MGM);
      }
      return (+totalPrice - +totalCost).toFixed(this.ROUNDING_MIX.MGM);
    },
    calculateMgmPercentMixin(totalPrice, totalCost) {
      if (!totalPrice || !totalCost) {
        return (0).toFixed(this.ROUNDING_MIX.MGM);
      }
      const totalRatio = +totalPrice / +totalCost;
      if (!isFinite(totalRatio)) {
        return (0).toFixed(this.ROUNDING_MIX.MGM);
      }
      return ((totalRatio - 1) * 100).toFixed(this.ROUNDING_MIX.MGM);
    },
    handleChangeMainCostMixin(e, attrCostName, attrPriceName) {
      const cost = +e.target.value.replace(/,/g, '.').trim();
      const costFixed = cost.toFixed(this.ROUNDING_MIX.PRICES);

      if (!isFinite(cost)) {
        e.target.value = this[attrCostName];
        return;
      }

      if (+this[attrCostName] === 0 && +this.attrRateMixin === 1) {
        this.attrRateMixin = (+this.getAccountRateMixin(cost)).toFixed(this.ROUNDING_MIX.RATE);
      }

      this[attrCostName] = costFixed;
      this.comparisonWithHistory(attrCostName, costFixed);
      if (this.attrSalesTypeMixin === saleTypes[0].value) {
        this[attrPriceName] = this.calculatePriceOutrightMixin(cost, this.attrRateMixin);
      } else {
        this[attrPriceName] = this.calculatePriceMixin(cost, this.attrRateMixin);
      }
      this.flagRecalculateOfferMixin = false;
    },
    handleChangeMainPriceMixin(e, attrPriceName, attrCostName) {
      const price = +e.target.value.replace(/,/g, '.').trim();
      const priceFixed = price.toFixed(this.ROUNDING_MIX.PRICES);

      // delete || +price === 0 || +this[attrCostName] === 0
      if (
        !isFinite(price)
        || priceFixed === this[attrPriceName]
      ) {
        e.target.value = this[attrPriceName];
        return;
      }
      this[attrPriceName] = priceFixed;
      let resCost = this[attrCostName];
      let resPrice = this[attrPriceName];
      if (this.attrSalesTypeMixin === saleTypes[0].value) {
        resCost = (this[attrCostName] * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier;
        resPrice = (this[attrPriceName] * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier;
      }
      this.attrRateMixin = this.calculateRateMixin(resCost, resPrice);
      this.flagRecalculateOfferMixin = false;
    },
    handleChangeCostMixin(e, attrCostName, attrPriceName) {
      const cost = +e.target.value.replace(/,/g, '.').trim();
      const costFixed = cost.toFixed(this.ROUNDING_MIX.PRICES);

      if (!isFinite(cost)) {
        e.target.value = this[attrCostName];
        return;
      }

      this[attrCostName] = costFixed;
      this.comparisonWithHistory(attrCostName, costFixed);
      this[attrPriceName] = this.calculatePriceMixin(this[attrCostName], this.attrRateMixin);
    },
    handleChangePriceMixin(e, attrCostName, attrPriceName) {
      const price = +e.target.value.replace(/,/g, '.').trim();
      const priceFixed = price.toFixed(this.ROUNDING_MIX.PRICES);

      if (
        !isFinite(price)
        || +this[attrCostName] === 0
        || priceFixed === this[attrPriceName]
      ) {
        e.target.value = this[attrPriceName];
        return;
      }

      this[attrPriceName] = priceFixed;
    },
    handleFocusZeroMixin(e) {
      if (+e.target.value === 0) {
        e.target.setSelectionRange(0, e.target.value.length);
      }
    },
  },
  mounted() {
    if (this.flagRecalculateOfferMixin) {
      // this.updatePrice();
      this.flagRecalculateOfferMixin = false;
    }
  },
};

export default offerMixin;
