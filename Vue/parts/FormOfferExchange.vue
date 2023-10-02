<template>
  <div class="rfq-form-offer" :class="{ 'rfq-form-offer--disabled': !attrSalesTypeMixin }">
    <!-- <div class="form-group rfq-form-offer__inline">
      {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_FLAT }}
      <div class="form-checkbox  rfq-form-offer__checkbox"> -->
<!--        @change="comparisonWithHistory('attrFlatExchange', $event.target.checked)"-->
        <!-- <input v-model.lazy="attrFlatExchange"
               class="form-checkbox__input" type="checkbox" id="rfq-exchange-flat">
        <label class="form-checkbox__label"
               for="rfq-exchange-flat">
          <svg-sprite :icon="iconCheckSprite" class="svg-icon-check form-checkbox__icon"/>
        </label>
      </div>
    </div> -->
    <div class="rfq-form-offer__body">
      <div class="rfq-form-offer__col">
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin"
             :class="{ 'form-group--error form-group--error-input':
              !isValidMixin() && showValidationErrorMixin(historyKeys.PRICE) }">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_EX_COST }} ({{historyCurrencyMixin.currency_symbol}}) <span class="form-label-required">*</span>
          </label>
          <input
            v-model.lazy.trim="attrExFeeCost"
            id="rfq-exchange-fee-cost"
            tabindex="1"
            @change="handleChangeMainCostMixin($event, 'attrExFeeCost', 'attrExFeePrice')"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrExFeeCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrExFeeCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_BER_COST }} ({{historyCurrencyMixin.currency_symbol}})
          </label>
          <input
            v-model.lazy.trim="attrBerCost"
            id="rfq-exchange-ber-cost"
            tabindex="3"
            @change="handleChangeCostMixin($event, 'attrBerCost', 'attrBerPrice')"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrBerCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrBerCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_VENDOR_RTRN }}
          </label>
          <input v-model.trim="attrVendorRtrnDays" @change="comparisonWithHistory('attrVendorRtrnDays', $event.target.value)"
                 id="rfq-exchange-rtrn-day" tabindex="5" type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_LEAD_TIME }}
          </label>
          <input v-model.trim="attrLeadTime" @change="comparisonWithHistory('attrLeadTime', $event.target.value)"
                 id="rfq-exchange-lead-time" tabindex="7" type="text" class="form-input rfq-form-offer__input uppercase">
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_SERVICE_COST }} ({{historyCurrencyMixin.currency_symbol}})
          </label>
          <input
            v-model.lazy.trim="attrServiceCost"
            id="rfq-exchange-service-cost"
            tabindex="9"
            @change="handleChangeCostMixin($event, 'attrServiceCost', 'attrServicePrice')"
            @input="setFlagNewHistoryMixin"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrServiceCostConverted" class="rfq-offer-sub-price" v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{attrServiceCostConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_COST_TOTAL }} ({{historyCurrencyMixin.currency_symbol}})
          </label>
          <input :value="userPrice(totalCost, '')" id="rfq-exchange-total-cost" type="text" class="form-input rfq-form-offer__input" readonly>
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="totalCostConverted" class="rfq-offer-sub-price" readonly v-if="currencyHistoryComparisonMixin">
            <template slot="toggle">
              {{totalCostConverted | price}}
            </template>
          </edit-field>
        </div>
      </div>
      <div class="rfq-form-offer__col">
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_EX_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
          </label>
          <input
            :value="attrExFeePrice"
            id="rfq-exchange-fee-price"
            tabindex="2"
            @change="handleChangeMainPriceMixin($event, 'attrExFeePrice', 'attrExFeeCost')"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrExFeePriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
            <template slot="toggle" >
              {{attrExFeePriceConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_BER_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
          </label>
          <input
            :value="attrBerPrice"
            id="rfq-exchange-ber-price"
            tabindex="4"
            @change="handleChangePriceMixin($event, 'attrBerCost', 'attrBerPrice')"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrBerPriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
            <template slot="toggle">
              {{attrBerPriceConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_CUST_RTRN }}
          </label>
          <input v-model.lazy.trim="attrCustomRtrnDays" id="rfq-exchange-rtrn-priceday" tabindex="6" type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_DELIVERY_TIME }}
          </label>
          <input v-model.lazy.trim="attrDeliveryTime" id="rfq-exchange-delivery-time" tabindex="8" type="text" class="form-input rfq-form-offer__input uppercase">
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_SERVICE_PRICE }} ({{rfqCurrencyMixin.currency_symbol}})
          </label>
          <input
            :value="attrServicePrice"
            id="rfq-exchange-service-price"
            tabindex="10"
             @change="handleChangePriceMixin($event, 'attrServiceCost', 'attrServicePrice')"
            @focus="handleFocusZeroMixin"
            type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="attrServicePriceConverted" class="rfq-offer-sub-price" v-if="currencyRfqComparisonMixin">
            <template slot="toggle">
              {{attrServicePriceConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group rfq-form-offer__no-margin">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_TOTAL }} ({{rfqCurrencyMixin.currency_symbol}})
          </label>
          <input :value="userPrice(totalPrice, '')" id="rfq-exchange-total-price" type="text" class="form-input rfq-form-offer__input" readonly>
        </div>
        <div class="form-group rfq-form-offer__group">
          <edit-field :init-value.sync="totalPriceConverted" class="rfq-offer-sub-price" readonly v-if="currencyRfqComparisonMixin">
            <template slot="toggle">
              {{totalPriceConverted | price}}
            </template>
          </edit-field>
        </div>
        <div class="form-group rfq-form-offer__group"
             :class="{ 'form-group--error form-group--error-input':
             !isValidMixin(partKeys.RESPONSE) && showValidationErrorMixin(partKeys.QTY, partKeys.RESPONSE) }">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_QTY }}
          </label>
          <input v-model.lazy.trim="attrQty" id="rfq-exchange-qty" type="text" class="form-input rfq-form-offer__input">
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_MGM }} ({{companyCurrency.currency_symbol}})
          </label>
          <input :value="userPrice(mgmBenefit, '')" id="rfq-exchange-mgm" type="text" class="form-input rfq-form-offer__input" readonly>
        </div>
        <div class="form-group rfq-form-offer__group">
          <label class="form-label rfq-form-offer__label">
            {{ translate.RFQ_LABEL_PART_OFFER_EXCHANGE_MGM }} (%)
          </label>
          <input :value="userPrice(mgmPercent, '')" id="rfq-exchange-mgm-percent" type="text" class="form-input rfq-form-offer__input" readonly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { RFQ_NAMESPACE, RFQ_NAMESPACE_PARTS, RFQ_COMBO_NAMESPACE_PARTS, AUTH_NAMESPACE } from '@/store/namespaces';
import { getNS } from '@/store';

import { RFQ_PARTS_SET_PART_PROPERTY, RFQ_PARTS_SET_FLAG } from '@/store/modules/rfq/mutation.types';
import { RFQ_PARTS_ACTION_VALIDATE_PART } from '@/store/modules/rfq/action.types';

import { partKeyNames, historyKeyNames } from '@/store/modules/rfq/key.names';
import { SvgSprite } from '@/components/gui';
import { iconCheckSprite } from '@/assets/svg';
import EditField from '@/components/gui/edit-field/EditField';

import { offerMixin } from '../mixins/offer.mixin';
import rateMixin from '../mixins/rate.mixin';
import validationMixin from '../mixins/validation.mixin';

export default {
  name: 'RFQPartsFormOfferExchange',
  components: {
    SvgSprite,
    EditField,
  },
  mixins: [rateMixin, offerMixin, validationMixin],
  props: {
    translate: Object,
  },
  beforeCreate() {
    this.iconCheckSprite = iconCheckSprite;
    this.historyKeys = historyKeyNames;
    this.partKeys = partKeyNames;
  },
  created() {
    this[RFQ_PARTS_SET_PART_PROPERTY]({
      type: partKeyNames.RESPONSE,
      name: partKeyNames.QTY,
      value: this.attrQty,
    });
  },
  data() {
    return {
      changePrice: false,
    };
  },
  computed: {
    parentPart() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].parentPart;
    },
    attrRequestedQty() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.QTY,
        target: this.parentPart,
      });
    },
    // attrFlatExchange: {
    //   get() {
    //     return this.getPartProperty({
    //       type: partKeyNames.HISTORY,
    //       name: partKeyNames.SALE_EXCHANGE_FLAT_EXCHANGE,
    //       path: historyKeyNames.OFFER_BY_SALES_TYPE,
    //     });
    //   },
    //   set(value) {
    //     this[RFQ_PARTS_SET_PART_PROPERTY]({
    //       type: partKeyNames.HISTORY,
    //       name: partKeyNames.SALE_EXCHANGE_FLAT_EXCHANGE,
    //       path: historyKeyNames.OFFER_BY_SALES_TYPE,
    //       value,
    //     });
    //     if (value) {
    //       const nowNotes = this.getPartProperty({
    //         type: partKeyNames.HISTORY,
    //         name: historyKeyNames.NOTES,
    //       });
    //       let newNotes;
    //       if (nowNotes && nowNotes.length > 0) {
    //         newNotes = `${nowNotes}\nFLAT RATE EXCHANGE`;
    //       } else {
    //         newNotes = 'FLAT RATE EXCHANGE';
    //       }
    //       this[RFQ_PARTS_SET_PART_PROPERTY]({
    //         type: partKeyNames.HISTORY,
    //         name: historyKeyNames.NOTES,
    //         value: newNotes,
    //       });
    //     }
    //     this.setFlagNewHistoryMixin();
    //   },
    // },
    attrExFeeCost: {
      get() {
        const exFeeCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
        }) || 0;
        return exFeeCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
          value,
        });
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrExFeeCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrExFeeCostConverted = 0;
        }
      },
    },
    attrExFeeCostConverted: {
      get() {
        const exFeeCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE_CONVERTED,
        }) || 0;
        return exFeeCost.toFixed(this.ROUNDING_MIX.PRICES);
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
    attrExFeePrice: {
      get() {
        const exFeePrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return exFeePrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this.changePrice = true;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrExFeePriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrExFeePriceConverted: {
      get() {
        const exFeePrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return exFeePrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrBerCost: {
      get() {
        const berCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return berCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrBerCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrBerCostConverted = 0;
        }
      },
    },
    attrBerCostConverted: {
      get() {
        const berCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return berCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_BER_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrBerPrice: {
      get() {
        const berPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return berPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrBerPriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrBerPriceConverted: {
      get() {
        const berPrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return berPrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_BER_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrVendorRtrnDays: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_VENDOR_RTRN_DAYS,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_VENDOR_RTRN_DAYS,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
        this.attrCustomRtrnDays = value;
      },
    },
    attrCustomRtrnDays: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_CUSTOM_RTRN_DAYS,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_CUSTOM_RTRN_DAYS,
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
        this.setFlagNewHistoryMixin();
        this.attrDeliveryTime = value;
      },
    },
    attrDeliveryTime: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_DELIVERY_TIME,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_DELIVERY_TIME,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    attrServiceCost: {
      get() {
        const serviceCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return serviceCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
        if (this.historyCurrencyMixin.entity_rate) {
          this.attrServiceCostConverted = value / this.historyCurrencyMixin.entity_rate;
        } else {
          this.attrServiceCostConverted = 0;
        }
      },
    },
    attrServiceCostConverted: {
      get() {
        const serviceCost = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return serviceCost.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        if (!isFinite(value)) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_COST_CONVERTED,
          path: historyKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrServicePrice: {
      get() {
        const servicePrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return servicePrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
        this.attrServicePriceConverted = value / this.rfqCurrencyMixin.entity_rate;
      },
    },
    attrServicePriceConverted: {
      get() {
        const servicePrice = +this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
        return servicePrice.toFixed(this.ROUNDING_MIX.PRICES);
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_SERVICE_PRICE_CONVERTED,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value,
        });
      },
    },
    attrQty: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_EXCHANGE_QTY,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        }) || 0;
      },
      set(value) {
        if (!isFinite(value) || value < 1) return;
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.SALE_EXCHANGE_QTY,
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
    totalCost() {
      return this.$store.getters[getNS([RFQ_COMBO_NAMESPACE_PARTS, 'getExchangeTotalCost'])]();
    },
    totalCostConverted() {
      if (this.historyCurrencyMixin.entity_rate) {
        return this.totalCost / this.historyCurrencyMixin.entity_rate;
      }
      return 0;
    },
    totalPrice() {
      return this.$store.getters[getNS([RFQ_COMBO_NAMESPACE_PARTS, 'getExchangeTotalPrice'])]();
    },
    totalPriceConverted() {
      return this.totalPrice / this.rfqCurrencyMixin.entity_rate;
    },
    mgmBenefit() {
      return this.calculateMgmBenefitMixin(this.totalPriceConverted, this.totalCostConverted);
    },
    mgmPercent() {
      return this.calculateMgmPercentMixin(this.totalPriceConverted, this.totalCostConverted);
    },
    ...mapGetters(AUTH_NAMESPACE, [
      'userPrice',
    ]),
  },
  methods: {
    updatePrice() {
      this.attrExFeePrice = this.calculatePriceMixin(this.attrExFeeCost, this.attrRateMixin);
    },
    recalculatePrices() {
      this.attrBerPrice = this.calculatePriceMixin(this.attrBerCost, this.attrRateMixin);
      this.attrServicePrice = this.calculatePriceMixin(this.attrServiceCost, this.attrRateMixin);
      this.changePrice = false;
    },
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_SET_PART_PROPERTY,
        RFQ_PARTS_SET_FLAG,
      ]),
    ...mapActions(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_ACTION_VALIDATE_PART,
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
    attrExFeeCost() {
      if (!this.flagRecalculateOfferMixin) {
        return;
      }
      this.updatePrice();
    },
    // attrVendorRtrnDays: {
    //   immediate: true,
    //   handler() {
    //     this.attrCustomRtrnDays = this.attrVendorRtrnDays;
    //   },
    // },
    flagCurrentLineOfferedMixin: {
      immediate: true,
      handler(value) {
        if (value) {
          this.recalculatePrices();
          this.flagCurrentLineOfferedMixin = false;
        }
      },
    },
    flagSetVendorReturnDaysMixin: {
      immediate: true,
      handler(value) {
        if (value) {
          this.attrCustomRtrnDays = this.attrVendorRtrnDays;
          this.flagSetVendorReturnDaysMixin = false;
        }
      },
    },
    flagSetDeliveryTimeMixin: {
      immediate: true,
      handler(value) {
        if (value) {
          this.attrDeliveryTime = this.attrLeadTime;
          this.flagSetDeliveryTimeMixin = false;
        }
      },
    },
  },
};
</script>
