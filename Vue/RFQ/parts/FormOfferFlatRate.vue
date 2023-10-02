<template>
  <div class="rfq-form-offer" :class="{ 'rfq-form-offer--disabled': !attrSalesTypeMixin }">
    <div class="rfq-form-offer__body">
      <div class="rfq-form-offer__col">
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_B_CHECK_COST }} ({{historyCurrencyMixin.currency_symbol}})
          </label>
          <input
            v-model.lazy.trim="attrBCheckCost"
            id="rfq-flatrate-bcost"
            tabindex="1"
            @change="handleChangeCostMixin($event, 'attrBCheckCost', 'attrBCheckPrice')"
            @input="setFlagNewHistoryMixin"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrBCheckCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrBCheckCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_LEAD_B_CHECK }}
          </label>
          <input v-model.trim="attrLeadBCheck" @change="comparisonWithHistory('attrLeadBCheck', $event.target.value)"
                 id="rfq-flatrate-bcheck" tabindex="3" type="text" class="form-input rfq-form-offer__input uppercase">
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin"
             :class="{ 'form-group--error form-group--error-input': !isValidMixin() && showValidationErrorMixin(historyKeys.PRICE) }">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_AVG_FLATRATE_COST }} ({{historyCurrencyMixin.currency_symbol}}) <span class="form-label-required">*</span>
          </label>
          <input
            v-model.lazy.trim="attrAvgFlatRateCost"
            id="rfq-flatrate-avg-cost"
            tabindex="5"
            @change="handleChangeMainCostMixin($event, 'attrAvgFlatRateCost', 'attrAvgFlatRatePrice')"
            @input="setFlagNewHistoryMixin"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrAvgFlatRateCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrAvgFlatRateCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_LEAD_TIME }}
          </label>
          <input v-model.trim="attrLeadTime" @change="comparisonWithHistory('attrLeadTime', $event.target.value)"
                 id="rfq-flatrate-lead-time" tabindex="7" type="text" class="form-input rfq-form-offer__input uppercase">
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRAT_MAX_FLATRATE_COST }} ({{historyCurrencyMixin.currency_symbol}})
          </label>
          <input
            v-model.lazy.trim="attrMaxFlatRateCost"
            id="rfq-flatrate-max-cost"
            tabindex="9"
            @change="handleChangeCostMixin($event, 'attrMaxFlatRateCost', 'attrMaxFlatRatePrice')"
            @input="setFlagNewHistoryMixin"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrMaxFlatRateCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrMaxFlatRateCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_MGM }} ({{companyCurrency.currency_symbol}})
          </label>
          <input :value="userPrice(mgmBenefit, '')" type="text" id="rfq-flatrate-mgm-price" class="form-input rfq-form-offer__input" readonly>
        </div>
      </div>
      <div class="rfq-form-offer__col">
        <div class="rfq-form-offer__col">
          <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_B_CHECK_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
            </label>
            <input
              :value="attrBCheckPrice"
              id="rfq-flatrate-bprice"
              tabindex="2"
              @change="handleChangePriceMixin($event, 'attrBCheckCost', 'attrBCheckPrice')"
              @focus="handleFocusZeroMixin"
              type="text" class="form-input rfq-form-offer__input">
          </div>
          <div class="form-group rfq-form-offer__group">
            <edit-field :init-value.sync="attrBCheckPriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
              <template slot="toggle">
                {{attrBCheckPriceConverted | price}}
              </template>
            </edit-field>
          </div>
          <div class="form-group rfq-form-offer__group">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_DELIVERY_B_CHECK }}
            </label>
            <input v-model.lazy.trim="attrDeliveryBCheck" id="rfq-flatrate-bcheck-price"  tabindex="4" type="text" class="form-input rfq-form-offer__input uppercase">
          </div>
          <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_AVG_FLATRATE_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
            </label>
            <input
              :value="attrAvgFlatRatePrice"
              id="rfq-flatrate-avg-price"
              tabindex="6"
              @change="handleChangeMainPriceMixin($event, 'attrAvgFlatRatePrice', 'attrAvgFlatRateCost')"
              @focus="handleFocusZeroMixin"
              type="text" class="form-input rfq-form-offer__input">
          </div>
          <div class="form-group rfq-form-offer__group">
            <edit-field :init-value.sync="attrAvgFlatRatePriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
              <template slot="toggle">
                {{attrAvgFlatRatePriceConverted | price}}
              </template>
            </edit-field>
          </div>
          <div class="form-group rfq-form-offer__group">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_DELIVERY_TIME }}
            </label>
            <input v-model.lazy.trim="attrDeliveryTime" id="rfq-flatrate-delivery-time" tabindex="8" type="text" class="form-input rfq-form-offer__input uppercase">
          </div>
          <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_MAX_FLATRATE_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
            </label>
            <input
              :value="attrMaxFlatRatePrice"
              id="rfq-flatrate-max-price"
              tabindex="10"
              @change="handleChangePriceMixin($event, 'attrMaxFlatRateCost', 'attrMaxFlatRatePrice')"
              @focus="handleFocusZeroMixin"
              type="text" class="form-input rfq-form-offer__input">
          </div>
          <div class="form-group rfq-form-offer__group">
            <edit-field :init-value.sync="attrMaxFlatRatePriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
              <template slot="toggle">
                {{attrMaxFlatRatePriceConverted | price}}
              </template>
            </edit-field>
          </div>
          <!--<div class="form-group rfq-form-offer__group">-->
            <!--<label class="form-label rfq-form-offer__label">QTY</label>-->
            <!--<input value="" type="text" class="form-input rfq-form-offer__input">-->
          <!--</div>-->
          <div class="form-group rfq-form-offer__group">
            <label class="form-label rfq-form-offer__label">
              {{ translate.RFQ_LABEL_PART_OFFER_FLATRATE_MGM }} (%)
            </label>
            <input :value="userPrice(mgmPercent, '')" type="text" id="rfq-flatrate-mgm-percent" class="form-input rfq-form-offer__input" readonly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { RFQ_COMBO_NAMESPACE_PARTS, AUTH_NAMESPACE, RFQ_NAMESPACE } from '@/store/namespaces';
import { RFQ_PARTS_SET_PART_PROPERTY, RFQ_PARTS_SET_FLAG } from '@/store/modules/rfq/mutation.types';
import { partKeyNames, historyKeyNames, rfqKeyNames } from '@/store/modules/rfq/key.names';
import EditField from '@/components/gui/edit-field/EditField';
import { offerMixin } from '../mixins/offer.mixin';
import rateMixin from '../mixins/rate.mixin';
import validationMixin from '../mixins/validation.mixin';

export default {
  name: 'RFQPartsFormOfferFlatRate',
  components: {
    EditField,
  },
  mixins: [offerMixin, rateMixin, validationMixin],
  props: {
    translate: Object,
  },
  beforeCreate() {
    this.historyKeys = historyKeyNames;
  },
  data() {
    return {
      changePrice: false,
    };
  },
  computed: {
    attrBCheckCost: {
      get() {
        const bCheckCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return bCheckCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrBCheckCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrBCheckCostConverted = 0;
        }
      },
    },
    attrBCheckCostConverted: {
      get() {
        const bCheckCostConverted = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return bCheckCostConverted.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrBCheckPrice: {
      get() {
        const bCheckPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return bCheckPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrBCheckPriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrBCheckPriceConverted: {
      get() {
        const bCheckPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return bCheckPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_B_CHECK_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrLeadBCheck: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_LEAD_B_CHECK,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_LEAD_B_CHECK,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
        this.attrDeliveryBCheck = value;
      },
    },
    attrDeliveryBCheck: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_DELIVERY_B_CHECK,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_DELIVERY_B_CHECK,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    attrAvgFlatRateCost: {
      get() {
        const avgCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
        }) || 0;
        return avgCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
          value,
        });
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrAvgFlatRateCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrAvgFlatRateCostConverted = 0;
        }
      },
    },
    attrAvgFlatRateCostConverted: {
      get() {
        const avgCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE_CONVERTED,
        }) || 0;
        return avgCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE_CONVERTED,
          value,
        });
      },
    },
    attrAvgFlatRatePrice: {
      get() {
        const avgPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_AVG_FLATRATE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return avgPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this.changePrice = true;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_AVG_FLATRATE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrAvgFlatRatePriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrAvgFlatRatePriceConverted: {
      get() {
        const avgPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_AVG_FLATRATE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return avgPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_AVG_FLATRATE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrLeadTime: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.LEAD_TIME,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.LEAD_TIME,
          value: !value ? value : value.toUpperCase(),
        });
        this.attrDeliveryTime = value;
        this.setFlagNewHistoryMixin();
      },
    },
    attrDeliveryTime: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_DELIVERY_TIME,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_DELIVERY_TIME,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    attrMaxFlatRateCost: {
      get() {
        const maxCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return maxCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrMaxFlatRateCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrMaxFlatRateCostConverted = 0;
        }
        this.setFlagNewHistoryMixin();
      },
    },
    attrMaxFlatRateCostConverted: {
      get() {
        const maxCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return maxCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrMaxFlatRatePrice: {
      get() {
        const maxPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return maxPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrMaxFlatRatePriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrMaxFlatRatePriceConverted: {
      get() {
        const maxPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return maxPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_MAX_FLATRATE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrQty: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_FLATRATE_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.SALE_FLATRATE_QTY,
            path: partKeyNames.OFFER_BY_SALES_TYPE,
            value,
          },
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.QTY,
            value,
          },
        ]);
      },
    },
    mgmBenefit() {
      return this.calculateMgmBenefitMixin(this.attrAvgFlatRatePriceConverted, this.attrAvgFlatRateCostConverted);
    },
    mgmPercent() {
      return this.calculateMgmPercentMixin(this.attrAvgFlatRatePriceConverted, this.attrAvgFlatRateCostConverted);
    },
    rfqCurrency() {
      if (!this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY]) {
        return null;
      }
      return this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY].currency_symbol;
    },
    ...mapGetters(AUTH_NAMESPACE, [
      'userPrice',
    ]),
  },
  methods: {
    updatePrice() {
      this.attrAvgFlatRatePrice = this.calculatePriceMixin(this.attrAvgFlatRateCost, this.attrRateMixin);
    },
    recalculatePrices() {
      this.attrBCheckPrice = this.calculatePriceMixin(this.attrBCheckCost, this.attrRateMixin);
      this.attrMaxFlatRatePrice = this.calculatePriceMixin(this.attrMaxFlatRateCost, this.attrRateMixin);
      this.changePrice = false;
    },
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_SET_PART_PROPERTY,
        RFQ_PARTS_SET_FLAG,
      ]),
  },
  watch: {
    attrRateMixin() {

      if (!this.flagRecalculateOfferMixin && this.changePrice) {
        this.recalculatePrices();
        return;
      }

      if (!this.flagRecalculateOfferMixin) {
        return;
      }
      this.recalculatePrices();
      this.updatePrice();
    },
    attrAvgFlatRateCost() {
      if (!this.flagRecalculateOfferMixin) {
        return;
      }
      this.updatePrice();
    },
    flagCurrentLineOfferedMixin: {
      immediate: true,
      handler(value) {
        if (value) {
          this.recalculatePrices();
          this.flagCurrentLineOfferedMixin = false;
        }
      },
    },
    flagSetDeliveryTimeMixin: {
      immediate: true,
      handler(value) {
        if (value) {
          this.attrDeliveryTime = this.attrLeadTime;
          this.attrDeliveryBCheck = this.attrLeadBCheck;
          this.flagSetDeliveryTimeMixin = false;
        }
      },
    },
  },
};
</script>
