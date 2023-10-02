<template>
    <div class="block rfq-block-part-line">
      <div class="block-header rfq-block-header block-header--theme rfq-block-part-line__header rfq-block-header-row">
        {{ translate.RFQ_TITLE_PART_RESPONSE_BLOCK }}
        <template v-if="isHistoryChangedMixin && selectedHistoryId">
          <div class="rfq-block-part-line__notification">
            <svg-sprite :icon="iconInfoSprite" class="svg-icon-info svg-icon-info--red rfq-block-part-line__notification-icon"/>
            {{ translate.RFQ_TEXT_HISTORY_CHANGED }}
          </div>
        </template>
        <span class="rfq-block-header-row-item">
          <div class="rfq-block-header-row-item--block">
            <span class="rfq-block-header-row-item--label">BASE UOM:</span>
            <span class="rfq-block-header-row-item--value rfq-block-header-uom--height">
              {{attrBaseUom.base_uom}}
            </span>
            <span class="rfq-block-header-row-item--value rfq-block-header-uom--height rfq-block-header-uom--left">
              1 {{attrResponseUom}} = {{((1 * getPartUomFromList.multiplier) / getPartUomFromList.divider).toFixed(4)}}{{attrBaseUom.base_uom}}
            </span>
          </div>
        </span>
      </div>
        <div class="block-content rfq-block-part-line__content">
            <div class="form-row">
                <div class="form-group rfq-block-part-line__group rfq-block-part-line__group--wide"
                     :class="{ 'form-group--error form-group--error-input':
                      !isValidMixin() && showValidationErrorMixin(historyKeys.VENDOR_CODE) }">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_VENDOR }} <span class="form-label-required">*</span>
                    </label>
                    <form-input-controls id="show-modal" @search="toggleDialog" @pin="handlePin" :pin="true" :clear="false" :searchId="'rfq-vendor-search'">
                        <input :value="attrVendorName" id="rfq-vendor-name" readonly="true" type="text" class="form-input form-input--readonly-default">
                    </form-input-controls>
                </div>
                <div class="form-group rfq-block-part-line__group">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_PN_AVAL }}
                    </label>
                    <input v-model.lazy.trim="attrResponsePartNumber"
                           @change="comparisonWithHistory('attrResponsePartNumber', $event.target.value.replace(/\s/g, ''))"
                           id="rfq-pn-aval" type="text" class="form-input uppercase">
                </div>
                <div class="form-group rfq-block-part-line__group">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_SALES_TYPE }}
                    </label>
                    <el-select v-model.lazy="attrSalesTypeMixin" @change="comparisonWithHistory('attrSalesTypeMixin', $event)" id="rfq-pn-salestype">
                        <el-option
                              v-for="(item, index) in selectSalesType"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group rfq-block-part-line__group rfq-block-part-line__group--wide"
                     :class="{ 'form-group--error form-group--error-input':
                      !isValidMixin() && showValidationErrorMixin(historyKeys.DESCRIPTION) }">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_DESCRIPTION }} <span class="form-label-required">*</span>
                    </label>
                    <input v-model.lazy.trim="attrResponseDescription" @change="comparisonWithHistory('attrResponseDescription', $event.target.value)"
                           id="rfq-pn-description" type="text" class="form-input uppercase">
                </div>
                <div class="form-group rfq-block-part-line__group"
                     :class="{ 'form-group--error form-group--error-input':
                      !isValidMixin() && showValidationErrorMixin(historyKeys.TAGS) }">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_TAGS }} <span class="form-label-required">*</span>
                    </label>
                    <dropdown class="rfq-part-tags"
                              class-name-button="rfq-part-tags__button"
                              class-name-box="rfq-part-tags__box"
                              class-name-icon-svg="rfq-part-tags__icon"
                              id="rfq-tags"
                              ref="tagsDropdown">
                        <template slot="button">
                            <div class="rfq-part-tags__state" :class="{ 'rfq-part-tags__state--filled': tagsFilled }">
                                {{ tagsFilled ? translate.RFQ_LABEL_PART_RES_TAG_FILLED : translate.RFQ_LABEL_PART_RES_TAG_NOT_FILLED }}
                            </div>
                        </template>
                        <template slot="content">
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_DATE }}
                                </label>
                                <input v-model.lazy.trim="attrTagsDate" @change="comparisonWithHistory('attrTagsDate', $event.target.value)"
                                       type="text" class="form-input uppercase" id="rfq-tag-date">
                            </div>
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_CERT_TYPE }}
                                </label>
                                <el-select
                                  v-model.lazy="attrTagsCerts"
                                  @change="comparisonWithHistory('attrTagsCerts', $event)"
                                  class="rfq-part-tags__certs"
                                  id="rfq-cert-type"
                                  :placeholder="translate.RFQ_PLACEHOLDER_PART_RES_TAG_SELECT_CERT_TYPE"
                                  popper-class="rfq-part-tags__popper"
                                  :popper-append-to-body="false"
                                  multiple>
                                    <el-option
                                            v-for="(item, index) in selectTagsCerts"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_TRACE }}
                                </label>
                                <el-select
                                  v-model.lazy="attrTagsTrace"
                                  @change="comparisonWithHistory('attrTagsTrace', $event)"
                                  id="rfq-trace"
                                  filterable
                                  allow-create
                                  :class="'uppercase-select'"
                                  :default-first-option="true"
                                  popper-class="rfq-part-tags__popper"
                                  :popper-append-to-body="false"
                                  :placeholder="translate.RFQ_PLACEHOLDER_PART_RES_TAG_SELECT_TRACE">
                                    <el-option
                                      v-for="(item, index) in selectTagsTrace"
                                      :key="index"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_WARRANTY }}
                                </label>
                                <el-select
                                  v-model.lazy="attrTagsWarranty"
                                  @change="comparisonWithHistory('attrTagsWarranty', $event)"
                                  id="rfq-warranty"
                                  class="uppercase"
                                  filterable
                                  allow-create
                                  :default-first-option="true"
                                  :class="'uppercase-select'"
                                  popper-class="rfq-part-tags__popper"
                                  :popper-append-to-body="false"
                                  :placeholder="translate.RFQ_PLACEHOLDER_PART_RES_TAG_SELECT_WARRANTY">
                                  <el-option
                                    v-for="(item, index) in selectTagsWarranty"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                                  </el-option>
                                </el-select>
                            </div>
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_SHOP }}
                                </label>
                                <input v-model.lazy.trim="attrTagsShop" @change="comparisonWithHistory('attrTagsShop', $event.target.value)"
                                       id="rfq-shop" type="text" class="form-input uppercase">
                            </div>
                            <div class="form-group rfq-part-tags__group">
                                <label class="form-label">
                                  {{ translate.RFQ_LABEL_PART_RES_TAG_SN }}
                                </label>
                                <input v-model.lazy.trim="attrTagsSn" @change="comparisonWithHistory('attrTagsSn', $event.target.value)"
                                       id="rfq-sn" type="text" class="form-input uppercase">
                            </div>

                            <div class="form-group rfq-part-tags__group">
                                <el-checkbox
                                  v-model.lazy="attrHazmat"
                                  :label="translate.RFQ_LABEL_PART_RES_TAG_HAZMAT"
                                  border
                                  class="rfq-hazmat"
                                  size="medium"
                                  @change="comparisonWithHistory('attrHazmat', $event)">
                                </el-checkbox>
                            </div>
                        </template>
                    </dropdown>
                </div>
                <div class="form-group rfq-block-part-line__group"
                     :class="{
                        'form-group--error form-group--error-input':
                        !isValidMixin(partKeys.RESPONSE) && showValidationErrorMixin(partKeys.RATE, partKeys.RESPONSE)
                       }">
                    <label class="form-label" v-if="companyRate === 'rate'">
                      {{ translate.RFQ_LABEL_PART_RES_RATE }} <span class="form-label-required">*</span>
                    </label>
                    <label class="form-label" v-if="companyRate === 'margin'">
                      Margin(%) <span class="form-label-required">*</span>
                    </label>
                    <label class="form-label" v-if="companyRate === 'markup'">
                      Markup(%) <span class="form-label-required">*</span>
                    </label>
                    <input v-model.lazy.trim="attrRateMixin" id="rfq-pn-rate" type="text" class="form-input" :readonly="!attrSalesTypeMixin">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group rfq-block-part-line__group  rfq-block-part-line__group--fix">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_AVAIL_QTY }}
                      <span class="rfq-form-offer-uom">
                        {{((attrAvailableQty * partUomParamsMixin.multiplier) / partUomParamsMixin.divider).toFixed(2)}} {{attrBaseUom.base_uom}}
                      </span>
                    </label>
                    <input v-model.lazy.trim="attrAvailableQty" @change="comparisonWithHistory('attrAvailableQty', $event.target.value)"
                           id="rfq-pn-aqty" type="text" class="form-input" :disabled="disabledInventoryQty">
                </div>
                <div class="form-group rfq-block-part-line__group rfq-block-part-line__group--fix">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_UOM }}
                    </label>
                    <el-select
                      v-model.lazy="attrResponseUom"
                      @change="handleChangeResponseUom"
                      id="rfq-pn-uom"
                      placeholder="-" filterable>
                        <el-option
                          v-for="(item, index) in selectUom"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                        <div class="uom-to-converted-title">
                          Add new UOM
                        </div>
                        <div v-for="item in uomToConverted" class="uom-to-converted-list" @click="handleAddUOM(item)">{{item}}</div>
                    </el-select>
                </div>
                <div class="form-group rfq-block-part-line__group"
                     :class="{ 'form-group--error form-group--error-input':
                      !isValidMixin() && showValidationErrorMixin(historyKeys.CONDITION) }">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_CD }}<span class="form-label-required">*</span>
                    </label>
                    <el-select
                      v-model.lazy="attrResponseCondition"
                      @change="comparisonWithHistory('attrResponseCondition', $event)"
                      id="rfq-pn-condition"
                      placeholder="-"
                      filterable>
                        <el-option
                          v-for="(item, index) in selectCondition"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="form-group rfq-block-part-line__group">
                    <label class="form-label">
                      {{ translate.RFQ_LABEL_PART_RES_LOCATION }}
                    </label>
                    <input v-model.lazy.trim="attrLocation" @change="comparisonWithHistory('attrLocation', $event.target.value)"
                           id="rfq-pn-location" type="text" class="form-input uppercase">
                </div>
            </div>
        </div>
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
import { Select, Option, Checkbox } from 'element-ui';
import { getValueByPath } from 'element-ui/src/utils/util';
import { Dropdown, FormInputControls, SvgSprite } from '@/components/gui';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { controlsKeyNames } from '@/store/modules/controls/key.names';
import { partKeyNames, historyKeyNames } from '@/store/modules/rfq/key.names';
import { saleTypes } from '@/store/modules/controls/controls.store';

import {
  RFQ_COMBO_NAMESPACE_PARTS,
  CONTROLS_NAMESPACE,
  RFQ_NAMESPACE,
  RFQ_NAMESPACE_PARTS,
  AUTH_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_PARTS_SET_PART_PROPERTY,
  RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY,
  RFQ_PARTS_SET_VENDOR_FOR_PART_LIST,
  RFQ_PARTS_SET_PART_HISTORY_HAZMAT_PROPERTY,
  RFQ_PARTS_SET_PART_CURRENT_UOM,
  RFQ_PARTS_RECOUNT_VENDOR_QTY,
} from '@/store/modules/rfq/mutation.types';
import { RFQ_PARTS_ACTION_VALIDATE_PART, RFQ_ACTION_GET_PART_INFO } from '@/store/modules/rfq/action.types';
import { getNS } from '@/store';
import { DialogAddPartConverterUOM } from '@/components/common/index';
import { iconInfoSprite } from '@/assets/svg';

import rateMixin from '../mixins/rate.mixin';
import newHistoryMixin from '../mixins/history-new.mixin';
import validationHistoryMixin from '../mixins/validation.mixin';
import offerMixin from '../mixins/offer.mixin';

export default {
  name: 'RFQPartsPartLine',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-checkbox': Checkbox,
    Dropdown,
    FormInputControls,
    SvgSprite,
    'dialog-add-part-uom': DialogAddPartConverterUOM,
  },
  props: {
    translate: Object,
  },
  mixins: [rateMixin, newHistoryMixin, validationHistoryMixin, offerMixin],
  beforeCreate() {
    this.partKeys = partKeyNames;
    this.historyKeys = historyKeyNames;
    this.iconInfoSprite = iconInfoSprite;
  },
  created() {
    this.$commonBus.$on('vendor-select:part', this.handleVendorSelect);
  },
  destroyed() {
    this.$commonBus.$off('vendor-select:part');
  },
  data() {
    return {
      // dialog add part converter uom
      showDialogAddPartConverterUom: false,
      dialogAddPartConverterUomPn: null,
      dialogAddPartConverterUomRates: [],
      dialogAddPartConverterUomMode: true,
      // dialogAddPartConverterUomFrom: null,
      // dialogAddPartConverterUomTo: null,
      dialogAddPartConverterUomPart: null,
    };
  },
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS, [
      'getPartProperty',
    ]),
    rfqCurrency() {
      const currencyObj = this.$store.state[AUTH_NAMESPACE].configCompany.currency;
      return currencyObj ? currencyObj.currency_symbol : null;
    },
    historyCurrency() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.CURRENCY,
      }) || {};
    },
    companyCurrency() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency;
    },
    parentPart() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].parentPart;
    },
    attrParent() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PARENT,
      });
    },
    attrVendorName() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.VENDOR_NAME,
        path: historyKeyNames.VENDOR,
      });
    },
    attrVendorCode() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.VENDOR_CODE,
        path: historyKeyNames.VENDOR,
      });
    },
    attrResponsePartNumber: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.PART_NUMBER,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.PART_NUMBER,
            value: !value ? value : value.toUpperCase(),
          },
          {
            type: partKeyNames.HISTORY,
            name: historyKeyNames.PART_NUMBER,
            value: !value ? value : value.toUpperCase(),
          },
        ]);
        this[RFQ_ACTION_GET_PART_INFO](value.toUpperCase());
        this.setFlagNewHistoryMixin();
      },
    },
    attrResponseDescription: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.DESCRIPTION,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.DESCRIPTION,
          value: value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrAvailableQty: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.QTY,
        }) || 0;
      },
      set(value) {
        const responseQty = value.replace(/,/g, '.');
        if (isNaN(responseQty) || responseQty < 1) return;
        let reqQty = this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.QTY,
        });
        if (!reqQty) {
          reqQty = this.getPartProperty({
            type: partKeyNames.REQUEST,
            name: partKeyNames.QTY,
            target: this.parentPart,
          });
        }
        const reqMoq = this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_MOQ,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
        const convertedReqQty = (+reqQty * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
        const convertedResQty = (+responseQty * this.partUomParamsMixin.multiplier) / this.partUomParamsMixin.divider;
        const convertedResMoq = (+reqMoq * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
        const result = (+convertedResQty <= +convertedReqQty) ?
          (+convertedResQty * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier :
          (+convertedReqQty * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier;
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.QTY,
            value: (convertedReqQty < convertedResMoq) ?
              (+convertedResMoq * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier : result,
          },
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.VENDOR_QTY,
            value: (+convertedResQty <= +convertedReqQty) ?
              (+convertedResQty * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier :
              (+convertedReqQty * this.partUomParamsMixin.divider) / this.partUomParamsMixin.multiplier,
          },
          {
            type: partKeyNames.RESPONSE,
            name: this.qtySalesTypeKey,
            path: partKeyNames.OFFER_BY_SALES_TYPE,
            value: (convertedReqQty < convertedResMoq) ?
              (+convertedResMoq * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier : result,
          },
          {
            type: partKeyNames.HISTORY,
            name: historyKeyNames.QTY,
            value: responseQty,
          },
        ]);
        this.setFlagNewHistoryMixin();
      },
    },
    attrResponseUom: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.UOM,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.UOM,
          value,
        });
      },
    },
    attrResponseCondition: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.CONDITION,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.CONDITION,
          value,
        });
      },
    },
    attrLocation: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.LOCATION,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.LOCATION,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsDate: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_DATE,
          path: historyKeyNames.TAGS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_DATE,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsCerts: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_CERTS,
          path: historyKeyNames.TAGS,
        }) || [];
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_CERTS,
          value,
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsTrace: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_TRACE,
          path: historyKeyNames.TAGS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_TRACE,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsWarranty: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_WARRANTY,
          path: historyKeyNames.TAGS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_WARRANTY,
          value: value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsShop: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_SHOP,
          path: historyKeyNames.TAGS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_SHOP,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrTagsSn: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.TAGS_SN,
          path: historyKeyNames.TAGS,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY]({
          name: historyKeyNames.TAGS_SN,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrHazmat: {
      get() {
        if (this.getPartProperty({ type: partKeyNames.HISTORY, name: historyKeyNames.IS_HAZMAT, path: historyKeyNames.HAZMAT }) === 0) {
          return false;
        }
        return true;
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_HISTORY_HAZMAT_PROPERTY](!value ? 0 : 1);
        // this[RFQ_PARTS_SET_PART_PROPERTY]({
        //   type: partKeyNames.HISTORY,
        //   name: historyKeyNames.IS_HAZMAT,
        //   path: historyKeyNames.HAZMAT,
        //   value: !value ? 0 : 1,
        // });
        this.setFlagNewHistoryMixin();
      },
    },
    tagsFilled() {
      const isCertificates = this.attrTagsCerts !== undefined ? this.attrTagsCerts.length > 0 : false;
      return isCertificates || this.attrTagsDate || this.attrTagsShop || this.attrTagsSn || this.attrTagsWarranty || this.attrTagsTrace;
    },
    selectedVendor() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.VENDOR,
      });
    },
    selectedHistoryId() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.HISTORY_ID,
      });
    },
    qtySalesTypeKey() {
      let qtyKey;
      switch (this.attrSalesType) {
        case saleTypes[1].value:
          qtyKey = partKeyNames.SALE_EXCHANGE_QTY;
          break;
        case saleTypes[2].value:
          qtyKey = partKeyNames.SALE_REPAIR_QTY;
          break;
        case saleTypes[4].value:
          qtyKey = partKeyNames.SALE_FLATRATE_QTY;
          break;
        default:
          qtyKey = partKeyNames.SALE_OUTRIGHT_QTY;
          break;
      }
      return qtyKey;
    },
    attrSalesType() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.SALES_TYPE,
      });
    },
    HISTORY_TYPE() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].HISTORY_TYPE;
    },
    currentHistoryTab() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyCurrentTab;
    },
    disabledInventoryQty() {
      return this.currentHistoryTab === this.HISTORY_TYPE.INVENTORY;
    },
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
    getPartUomFromList() {
      if (this.attrBaseUom.uom.length > 0) {
        return this.attrBaseUom.uom.find(uom => uom.from_uom === this.attrResponseUom) || { multiplier: 1, divider: 1 };
      }
      return { multiplier: 1, divider: 1 };
    },
    selectUom() {
      const uomlist = [];
      for (let i = 0; i < this.attrBaseUom.uom.length; i++) {
        uomlist.push(this.attrBaseUom.uom[i].from_uom);
      }
      return uomlist;
    },
    uomToConverted() {
      const uomList = this.getOptions('usageunit');
      return uomList.filter(uom => !this.selectUom.includes(uom));
    },
    ...mapGetters(CONTROLS_NAMESPACE, [
      'picklists',
    ]),
    ...mapState(CONTROLS_NAMESPACE, {
      selectCondition: state => state.static[controlsKeyNames.PN_CONDITION],
      // selectUom: state => state.static[controlsKeyNames.UOM],
      selectSalesType: state => state[controlsKeyNames.SALES_TYPE],
      selectTagsTrace: state => state.static[controlsKeyNames.TAGS_TRACE],
      selectTagsCerts: state => state.static[controlsKeyNames.TAGS_CERTS],
      selectTagsWarranty: state => state.static[controlsKeyNames.WARRANTY],
    }),
  },
  watch: {
    attrVendorCode() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.VENDOR_CODE });
      }
    },
    attrResponseDescription() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.DESCRIPTION });
      }
    },
    attrTagsCerts() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.TAGS });
      }
    },
    attrRateMixin() {
      if (!this.isValidMixin(partKeyNames.RESPONSE)) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: partKeyNames.RATE, type: partKeyNames.RESPONSE });
      }
    },
    attrResponseCondition() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.CONDITION });
      }
    },
    tagsFilled() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.TAGS });
      }
    },
  },
  methods: {
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_SET_PART_PROPERTY,
        RFQ_PARTS_SET_PART_HISTORY_TAGS_PROPERTY,
        RFQ_PARTS_SET_PART_HISTORY_HAZMAT_PROPERTY,
      ]),
    ...mapMutations(RFQ_NAMESPACE,
      [
        RFQ_PARTS_SET_PART_CURRENT_UOM,
        RFQ_PARTS_RECOUNT_VENDOR_QTY,
      ]),
    ...mapActions(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_ACTION_VALIDATE_PART,
      ]),
    ...mapActions(RFQ_NAMESPACE, [
      RFQ_ACTION_GET_PART_INFO,
    ]),
    getOptions(name) {
      const pickList = this.picklists(name);
      if (pickList === null) {
        return getValueByPath(pickList, name);
      }
      return pickList;
    },
    handlePin() {
      this.$store.commit(getNS([RFQ_COMBO_NAMESPACE_PARTS, RFQ_PARTS_SET_VENDOR_FOR_PART_LIST]), this.selectedVendor);
    },
    toggleDialog() {
      this.$commonBus.$emit('open:vendor-list-dialog');
    },
    handleVendorSelect(vendor) {
      const selectedCurrency = vendor.currency.currency_id ?
        { entity_rate: vendor.currency.currency_rate, ...vendor.currency } : { entity_rate: this.companyCurrency.currency_rate, ...this.companyCurrency };
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.CURRENCY,
        value: selectedCurrency,
      });
      this.updateConvertedCostsMixin(selectedCurrency);
      this.updateRatePriceMixin(this.rfqCurrencyMixin.entity_rate, selectedCurrency.entity_rate);
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.VENDOR,
        value: vendor,
      });
      // delete stock
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.INVENTORY_BIT_ID,
        value: null,
      });
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.RFQ_ID,
        value: null,
      });
      this.setFlagNewHistoryMixin();
      this.toggleDialog();
    },
    handleChangeResponseUom(value) {
      this.comparisonWithHistory('attrResponseUom', value);
      this[RFQ_PARTS_SET_PART_CURRENT_UOM](this.attrBaseUom.uom.find(uom => uom.from_uom === value));
      this[RFQ_PARTS_RECOUNT_VENDOR_QTY]({ payload: this.attrBaseUom.uom.find(uom => uom.from_uom === value), list: this.attrBaseUom.uom });
    },
    handleAddUOM(uom) {
      this.dialogAddPartConverterUomPn = {
        name: this.attrResponsePartNumber,
        id: this.attrBaseUom.productid,
      };
      this.dialogAddPartConverterUomRates = [
        {
          from_uom: uom,
          to_uom: this.attrBaseUom.base_uom,
        },
      ];
      this.dialogAddPartConverterUomPart = {
        name: this.attrResponsePartNumber,
        id: this.attrBaseUom.productid,
      };
      this.showDialogAddPartConverterUom = true;
    },
    closeDialogAddPartUom(pn, part) {
      this.showDialogAddPartConverterUom = false;
      this[RFQ_ACTION_GET_PART_INFO](pn.name);
    },
  },
};
</script>
