<template>
    <div class="rfq-block-info block">
        <div class="block-header rfq-block-header">{{ translate.RFQ_TITLE_DETAILS }}</div>
        <div class="block-content">
            <!--First row-->
            <div class="form-row">
                <div class="rfq-block-info__group form-group">
                    <label for="rfq-customer-quote" class="form-label">{{ translate.RFQ_LABEL_DETAILS_CUSTOMER_QUOTE }}</label>
                    <input v-model.trim.lazy="rfqCustomerQuote" id="rfq-customer-quote" type="text" class="form-input uppercase">
                </div>
                <div class="rfq-block-info__group rfq-block-info__group--pad form-group">
                    <label for="rfq-experation-date" class="form-label">{{ translate.RFQ_LABEL_DETAILS_EXPIRATION_DATE }}</label>
                    <el-date-picker
                        ref="datepicker"
                        id="rfq-experation-date"
                        type="datetime"
                        v-model="rfqExpirationDate"
                        :editable="false"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :format="userDateTimeFormat"
                        class="form-date-picker">
                    </el-date-picker>
                </div>
                <div class="rfq-block-info__group form-group">
                    <label for="rfq-received-via" class="form-label">{{ translate.RFQ_LABEL_DETAILS_RECEIVED_VIA }}</label>
                    <input v-model.trim.lazy="rfqReceivedVia" id="rfq-received-via" type="text" class="form-input uppercase">
                </div>
            </div>
            <!--#First row-->

            <!--Second row-->
            <div class="form-row">
                <div class="rfq-block-info__group form-group">
                    <label for="rfq-tsale" class="form-label">{{ translate.RFQ_LABEL_DETAILS_TERMS_SALE }}</label>
                    <el-select
                        v-model="rfqTermsOfSale"
                        id="rfq-tsale"
                        class="fixed-height"
                        :disabled="!select.tsale"
                        :filterable="true"
                        :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_TERMS_SALE">
                        <el-option
                            v-for="(item, index) in select.tsale"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="rfq-block-info__group rfq-block-info__group--pad form-group">
                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_TERMS_DELIVERY }}</div>
                    <el-select
                      v-model="rfqTermsOfDelivery"
                      id="rfq-tdelivery"
                      :disabled="!select.tdelivery"
                      class="rfq-block-info__select-terms fixed-height"
                      :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_TERMS_DELIVERY">
                      <el-option
                        v-for="(item, index) in select.tdelivery"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </div>
                <div class="rfq-block-info__group form-group">
                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_PLACE_DELIVERY }}</div>
                    <input v-model.trim.lazy="rfqPlaceOfDelivery" id="rfq-pdelivery" type="text" class="rfq-block-info__input-terms form-input uppercase">
                </div>
            </div>
            <!--#Second row-->

            <!--Third row-->
            <div class="rfq-block-info__group-textarea form-group">
                <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_DESCRIPTION }}</div>
                <textarea
                  v-model.trim.lazy="rfqDescription"
                  class="rfq-block-info__textarea form-textarea uppercase"
                  name="" id="rfq-description" rows="5">
                </textarea>
            </div>
            <!--#Third row-->

            <!--Fourth row-->
            <div class="form-row">
                <div class="rfq-block-info__group form-group"
                     :class="{ 'form-group--error form-group--error-input': validateRfq && !isValidInfo && !validationResults[rfqKeys.TERRITORY] }">
                    <div class="form-label">
                      {{ translate.RFQ_LABEL_DETAILS_TERRITORY }}
                      <span v-if="$store.getters.enabledFeatures.RFQ.territoryRequired" class="form-label-required">*</span>
                    </div>
                    <el-select
                        v-model="rfqTerritory"
                        id="rfq-territory"
                        class="fixed-height"
                        :disabled="!select.territory"
                        :clearable="!$store.getters.enabledFeatures.RFQ.territoryRequired"
                        :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_TERRITORY">
                        <el-option
                            v-for="(item, index) in select.territory"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="rfq-block-info__group rfq-block-info__group--pad form-group"
                     :class="{ 'form-group--error form-group--error-input': validateRfq && !isValidInfo && !validationResults[rfqKeys.ASSIGNED_TO] }">
                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_ASSIGNED_TO }} <span class="form-label-required">*</span></div>
                    <el-select
                      v-model="rfqAssignedTo"
                      id="rfq-assigned"
                      class="fixed-height"
                      :disabled="!assignedTo.length"
                      :filterable="true"
                      :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_ASSIGNED_TO">
                      <el-option
                        v-for="(item, index) in assignedTo"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </div>
<!--                <div class="rfq-block-info__group form-group">-->
<!--                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_DATE }}</div>-->
<!--                    <el-date-picker-->
<!--                      v-model="rfqDate"-->
<!--                      id="rfq-date"-->
<!--                      :editable="false"-->
<!--                      :value-format="dateFormat"-->
<!--                      :format="dateFormat">-->
<!--                    </el-date-picker>-->
<!--                </div>-->
              <div class="rfq-block-info__group form-group">
                <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_REQUEST_DATE }}</div>
                <el-date-picker
                  v-model="rfqRequestDate"
                  type="datetime"
                  id="rfq-request-date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :format="userDateTimeFormat"
                  :editable="false">
                </el-date-picker>
              </div>
            </div>
            <!--#Fourth row-->

            <!--Fifth row-->
            <div class="form-row">
                <div class="rfq-block-info__group form-group"
                    :class="{ 'form-group--disabled': !rfqAccountId }">

                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_AIRCRAFT }}</div>
                    <form-input-controls :search="false" @clear="handleAircraftClear">
                        <el-select
                            v-model="rfqAircraft"
                            id="rfq-aircraft"
                            type="text"
                            :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_AIRCRAFT"
                            class="fixed-height"
                            :disabled="!rfqAccountId"
                            filterable>
                            <el-option
                                v-for="(item, index) in fleet"
                                :key="index"
                                :label="item.tail_number"
                                :value="item.fid">
                            </el-option>
                        </el-select>
                    </form-input-controls>
                </div>
                <div class="rfq-block-info__group rfq-block-info__group--pad form-group"
                    :class="{ 'form-group--disabled': !rfqAccountId }">
                    <!--//TODO: When select become enabled it change hight fix this -->
                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_LOCATION }}</div>
                    <form-input-controls :search="false" @clear="handleLocationClear">
                        <el-select
                          v-model="rfqLocation"
                          id="rfq-location"
                          :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_LOCATION"
                          class="fixed-height"
                          :disabled="!rfqAccountId"
                          filterable>
                          <el-option
                            v-for="(item, index) in locations"
                            :key="index"
                            :label="item.name"
                            :value="item.locid">
                          </el-option>
                        </el-select>
                    </form-input-controls>
                </div>
                <div class="rfq-block-info__group form-group">
                    <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_PROCESSED_BY }}</div>
                    <form-input-controls :search="false" @clear="handleProcessedClear">
                        <el-autocomplete
                          id="rfq-processed"
                          :value="rfqProcessed"
                          :value-key="'user_fio'"
                          :fetch-suggestions="getProcessed"
                          :trigger-on-focus="false"
                          :debounce="500"
                          :select-when-unmatched="true"
                          @select="handleUserSelect"
                          class="fixed-height"
                          :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_AUTOCOMPLETE_PROCESSED_BY"
                          ref="autocomplete">
                        </el-autocomplete>
                    </form-input-controls>
                </div>
            </div>
            <div class="form-row">
                <div class="rfq-block-info__group form-group">
                  <div class="form-label">Currency</div>
                  <el-select
                    v-model="rfqCurrency"
                    :value-key="'currency_name'"
                    id="rfq-currency"
                    placeholder="Type to Search"
                    class="fixed-height"
                    filterable>
                    <el-option
                      v-for="(item, index) in rfqCurrencyList"
                      :key="index"
                      :label="item.currency_code"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="rfq-block-info__group form-group rfq-block-info__group--pad">
                  <div class="form-label">Rate</div>
                  <input v-model="rfqRate" id="rfq-rate" type="text" class="form-input" :disabled="checkRFQCurrency">
                </div>
              <div class="rfq-block-info__group form-group">
                <div class="form-label">{{ translate.RFQ_LABEL_DETAILS_SOURCE }}</div>
                <el-select
                  v-model="rfqSource"
                  id="rfq-source"
                  :placeholder="translate.RFQ_PLACEHOLDER_DETAILS_SELECT_SOURCE"
                  class="fixed-height"
                  filterable>
                  <el-option
                    v-for="(item, index) in rfqSourceList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
            <!--#Fifth row-->

        </div>
    </div>
</template>

<script>
import { Select, Option, DatePicker, Input, Autocomplete } from 'element-ui';

import config from '@/config';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { controlsKeyNames } from '@/store/modules/controls/key.names';
import { rfqKeyNames } from '@/store/modules/rfq/key.names';

import {
  RFQ_NAMESPACE,
  CONTROLS_NAMESPACE,
  AUTH_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_INFO_SET_PROPERTY,
  RFQ_INFO_VALIDATE,
  RFQ_INFO_SAVE_CURRENCY,
  RFQ_INFO_SAVE_CURRENCY_RATE,
} from '@/store/modules/rfq/mutation.types';

import FormInputControls from '@/components/gui/form/FormInputControls';

import offerMixin from '../mixins/offer.mixin';

// TODO: validate location and fleet, in case where location_id | fleet_id is present but location does not exists in account locations | fleet list
// TODO: preloaders for Fleet and Locations
export default {
  name: 'RFQInfoView',
  mixins: [offerMixin],
  components: {
    FormInputControls,
    'el-input': Input,
    'el-date-picker': DatePicker,
    'el-select': Select,
    'el-option': Option,
    'el-autocomplete': Autocomplete,
  },
  beforeCreate() {
    this.rfqKeys = rfqKeyNames;
    this.dateFormat = config.dateFormat;
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    translate: {
      type: Object,
    },
  },
  computed: {
    userDateTimeFormat() {
      const dateFormat = ((this.$store.state[AUTH_NAMESPACE].profile.date_format).replace('DD', 'dd').replace('YYYY', 'yyyy').replace('YY', 'yy'));
      return `${dateFormat} HH:mm`;
    },
    validationResults() {
      return this.$store.state[RFQ_NAMESPACE].flags.validationInfoResults;
    },
    validateRfq() {
      return this.$store.state[RFQ_NAMESPACE].flags.validateRfq;
    },
    isValidInfo() {
      return this.$store.state[RFQ_NAMESPACE].flags.isValidInfo;
    },
    rfqAccountId() {
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ACCOUNT_ID];
    },
    rfqSourceList() {
      return this[controlsKeyNames.PICKLISTS]('rfq_source');
    },
    rfqCurrencyList() {
      const list = JSON.parse(JSON.stringify(this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.CURRENCY_LIST]));
      list.forEach((currency) => {
        if (!currency.entity_rate) {
          this.$set(currency, 'entity_rate', +currency.currency_rate);
          // currency.entity_rate = +currency.currency_rate;
        }
      });
      return list;
    },
    rfqCustomerQuote: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.CUSTOMER_QUOTE];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.CUSTOMER_QUOTE,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    rfqExpirationDate: {
      get() {
        return this.$options.filters.dayjsFormat(this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.EXPIRATION_DATE], { format: 'YYYY-MM-DD HH:mm:ss', time: true });
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.EXPIRATION_DATE,
          value: this.$options.filters.dayjsToISO(value),
        });
      },
    },
    rfqReceivedVia: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.RECEIVED_VIA];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.RECEIVED_VIA,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    rfqTermsOfSale: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.TERMS_OF_SALE];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.TERMS_OF_SALE,
          value,
        });
      },
    },
    rfqTermsOfDelivery: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.TERMS_OF_DELIVERY];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.TERMS_OF_DELIVERY,
          value,
        });
      },
    },
    rfqPlaceOfDelivery: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.PLACE_OF_DELIVERY];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.PLACE_OF_DELIVERY,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    rfqDescription: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.DESCRIPTION];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.DESCRIPTION,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    rfqTerritory: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.TERRITORY];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.TERRITORY,
          value,
        });
      },
    },
    rfqAssignedTo: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ASSIGNED_TO];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.ASSIGNED_TO,
          value,
        });
      },
    },
    rfqDate: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.DATE];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.DATE,
          value,
        });
      },
    },
    rfqAircraft: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.FLEET_ID];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.FLEET_ID,
          value,
        });
      },
    },
    rfqLocation: {
      get() {
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.LOCATION_ID];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.LOCATION_ID,
          value,
        });
      },
    },
    rfqProcessed: {
      get() {
        if (!this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.PROCESSED_BY]) {
          return null;
        }
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.PROCESSED_BY].user_fio;
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.PROCESSED_BY,
          value,
        });
      },
    },
    rfqRequestDate: {
      get() {
        // if (!this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.REQUEST_DATE]) {
        //   return this.$options.filters.dayjsFormat(new Date(), { format: 'YYYY-MM-DD HH:mm:ss', time: true });
        // }
        return this.$options.filters.dayjsFormat(this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.REQUEST_DATE], { format: 'YYYY-MM-DD HH:mm:ss', time: true });
        // return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.REQUEST_DATE];
      },
      set(value) {
        // value = this.$options.filters.userDateTime(value);
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.REQUEST_DATE,
          value: this.$options.filters.dayjsToISO(value),
        });
      },
    },
    rfqSource: {
      get() {
        if (!this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.SOURCE]) {
          return null;
        }
        return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.SOURCE];
      },
      set(value) {
        this[RFQ_INFO_SET_PROPERTY]({
          name: rfqKeyNames.SOURCE,
          value,
        });
      },
    },
    rfqCurrency: {
      get() {
        if (!this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY]) {
          return null;
        }
        return this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY];
      },
      set(value) {
        this.updateRatePriceMixin(+value.currency_rate, this.historyCurrencyMixin.entity_rate);
        this[RFQ_INFO_SAVE_CURRENCY](value);
      },
    },
    rfqRate: {
      get() {
        if (!this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY]) {
          return null;
        }
        return this.$store.state[RFQ_NAMESPACE][rfqKeyNames.CURRENCY].entity_rate;
      },
      set(value) {
        // const currency = this.rfqCurrency;
        // currency.entity_rate = +value;
        this.updateRatePriceMixin(+value || 1, this.historyCurrencyMixin.entity_rate);
        this[RFQ_INFO_SAVE_CURRENCY_RATE](value);
      },
    },
    companyCurrency() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency;
    },
    checkRFQCurrency() {
      if (this.rfqCurrency) {
        return this.rfqCurrency.currency_id === this.companyCurrency.currency_id
      }
      return false;
    },

    ...mapGetters(CONTROLS_NAMESPACE, [
      controlsKeyNames.PICKLISTS,
    ]),
    ...mapState(CONTROLS_NAMESPACE, {
      select: state => state.static,
      assignedTo: (state) => {
        const list = state[controlsKeyNames.ASSIGNED_TO];
        return !list ? [] : JSON.parse(list);
      },
      fleet: state => state[controlsKeyNames.FLEET],
      locations: state => state[controlsKeyNames.LOCATIONS],
    }),
  },
  watch: {
    rfqTerritory() {
      if (this.validateRfq && !this.isValidInfo && this.$store.getters.enabledFeatures.RFQ.territoryRequired) {
        this[RFQ_INFO_VALIDATE]({ name: rfqKeyNames.TERRITORY });
      }
    },
    rfqAssignedTo() {
      if (this.validateRfq && !this.isValidInfo) {
        this[RFQ_INFO_VALIDATE]({ name: rfqKeyNames.ASSIGNED_TO });
      }
    },
  },
  methods: {
    handleAircraftClear() {
      this.rfqAircraft = null;
    },
    handleLocationClear() {
      this.rfqLocation = null;
    },
    handleProcessedClear() {
      this.rfqProcessed = {
        id: null,
        user_fio: null,
      };
    },
    getProcessed(query, callback) {
      if (query.length < this.autocompleteMinChar) { callback([]); return; }

      this.$socket.sendObj({
        path: '/v1/user/list',
        data: {
          emit: 'autocomplete:processed',
        },
        params: {
          direction: 'asc',
          filter: { user_fio: query },
        },
      });

      this.$socketBus.$once('autocomplete:processed', (payload) => {
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
    handleUserSelect(user) {
      this.rfqProcessed = user;
    },
    ...mapMutations(RFQ_NAMESPACE, [
      RFQ_INFO_SET_PROPERTY,
      RFQ_INFO_VALIDATE,
      RFQ_INFO_SAVE_CURRENCY,
      RFQ_INFO_SAVE_CURRENCY_RATE,
    ]),
  },
};
</script>
