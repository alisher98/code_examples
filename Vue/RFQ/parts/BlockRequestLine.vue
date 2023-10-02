<template>
  <span>
    <block-collapse
      class="rfq-block-request-line"
      class-name-header="rfq-block-header rfq-block-request-line__header"
      class-name-content="rfq-block-request-line__content"
      class-name-button="rfq-block-request-line__collapse"
      class-name-button-icon="rfq-block-request-line__collapse-svg"
      :collapsed="false">
      <template slot="header">
        {{ translate.RFQ_TITLE_PART_REQUEST_BLOCK }}
      </template>
      <template slot="header-append">
        <div class="rfq-block-request-line__status" block-collapse-exclude>
          <span class="rfq-block-request-line__status-label">
            {{ translate.RFQ_LABEL_PART_WA }}
          </span>
          <div class="form-checkbox">
            <input class="form-checkbox__input" type="checkbox"
                   value="wa"
                   :checked="stateWA"
                   @change="handleStateChange"
                   id="rfq-part-will-advice">
            <label class="form-checkbox__label" for="rfq-part-will-advice">
              <svg-sprite :icon="iconCheckSprite" class="svg-icon-check form-checkbox__icon"/>
            </label>
          </div>
          <span class="rfq-block-request-line__status-label">
            {{ translate.RFQ_LABEL_PART_NQ }}
          </span>
          <div class="form-checkbox">
            <input class="form-checkbox__input" type="checkbox"
                   value="nq"
                   :checked="stateNQ"
                   @change="handleStateChange"
                   id="rfq-part-no-quote">
            <label class="form-checkbox__label" for="rfq-part-no-quote"  ref="checkbox-label">
              <svg-sprite :icon="iconCheckSprite" class="svg-icon-check form-checkbox__icon"/>
            </label>
          </div>
        </div>
      </template>
      <template slot="content" class="some-class">
        <div class="form-row">
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--pn-req"
               :class="{ 'form-group--error form-group--error-input':
                    !isValidMixin(partKeys.REQUEST) && showValidationErrorMixin(partKeys.PART_NUMBER, partKeys.REQUEST) }">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_PN }} <span class="form-label-required">*</span>
              <span style="margin-left: 90px;">
                <span v-if="isHazmat">
                  <svg-sprite :icon="iconHazmatSprite" class="svg-icon-hazmat--req"/>
                </span>
                <span v-if="isAttention" style="margin-left: 5px">
                  <svg-sprite :icon="iconAttentionRedSprite" class="svg-icon-attention--req"/>
                </span>
              </span>
            </label>
            <input type="text" id="rfq-pn-req" class="form-input uppercase" v-model.trim.lazy="attrPartNumber" :readonly="!attrParent">
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--description">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_DESCRIPTION }} <span class="form-label-required">*</span>
            </label>
            <el-autocomplete
              v-model.lazy.trim="attrRequestDescription"
              :fetch-suggestions="getDescription"
              :disabled="!attrParent"
              id="rfq-req-description"
              :class="'uppercase-select'"
              popper-class="rfq-block-request-line__suggestions"
              @focus="clearSuggestions"
              @select="handleDescriptionSelect"
              ref="autocomplete">
              <template slot-scope="scope">
                {{ scope.item }}
              </template>
            </el-autocomplete>
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--nsn">
            <label class="form-label">{{ translate.RFQ_LABEL_PART_REQ_NSN }}</label>
            <input type="text" id="rfq-req-nsn" class="form-input uppercase" v-model.trim.lazy="attrNsn" :readonly="!attrParent">
          </div>
          <div class="form-group rfq-block-request-line__group">
            <label class="form-label">{{ translate.RFQ_LABEL_PART_REQ_CAGE_CODE }}</label>
            <input type="text" id="rfq-req-cage" class="form-input" v-model.trim.lazy="attrRequestCage" :readonly="!attrParent">
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--sales-type">
            <label class="form-label">{{ translate.RFQ_LABEL_PART_REQ_SALES_TYPE }}</label>
            <el-select
              v-model="attrRequestSalesType"
              id="rfq-req-sales-type"
              @change="handleSalesTypeChange"
              :disabled="!attrParent"
              class="fixed-height">
              <el-option
                v-for="(item, index) in selectSalesType"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--qty-req"
               :class="{ 'form-group--error form-group--error-input':
                    !isValidMixin(partKeys.REQUEST) && showValidationErrorMixin(partKeys.QTY, partKeys.REQUEST) }">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_QTY }} <span class="form-label-required">*</span>
              <span class="rfq-form-offer-uom">
                {{((attrRequestQty * requestUomParams.multiplier) / requestUomParams.divider).toFixed(2)}} {{attrBaseUom.base_uom}}
              </span>
            </label>
            <input type="text" id="rfq-req-qty" class="form-input" v-model.trim.lazy="attrRequestQty" :readonly="!attrParent">
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--uom">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_UOM }}
              <span class="rfq-form-offer-uom">
                {{attrRequestUom}} = {{((1 * requestUomParams.multiplier) / requestUomParams.divider).toFixed(2)}} {{attrBaseUom.base_uom}}
              </span>
            </label>
            <el-select
              v-model="attrRequestUom"
              id="rfq-req-uom"
              :disabled="!attrParent"
              placeholder="-"
              class="fixed-height">
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
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--condition">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_CONDITION }}
            </label>
            <el-select
              v-model="attrRequestCondition"
              id="rfq-req-condition"
              :disabled="!attrParent"
              placeholder="-"
              class="fixed-height">
              <el-option
                v-for="(item, index) in selectCondition"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="form-group rfq-block-request-line__group rfq-block-request-line__group--saved-price">
            <label class="form-label">
              {{ translate.RFQ_LABEL_PART_REQ_SAVED_PRICE }} ({{currencySymbol}})
            </label>
            <input :value="userPrice(+attrSavedPrice, '')" id="rfq-save-price" type="text" class="form-input" readonly>
          </div>
        </div>
      </template>
    </block-collapse>
    <dialog-add-part-uom
      v-if="showDialogAddPartConverterUom"
      :show="showDialogAddPartConverterUom"
      :pn="dialogAddPartConverterUomPn"
      :part="dialogAddPartConverterUomPart"
      :rates="dialogAddPartConverterUomRates"
      :mode="dialogAddPartConverterUomMode"
      @close="closeDialogAddPartUom">
    </dialog-add-part-uom>
  </span>
</template>

<script>
import { Select, Option, Autocomplete } from 'element-ui';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { getValueByPath } from 'element-ui/src/utils/util';
import { getNS } from '@/store';
import { controlsKeyNames } from '@/store/modules/controls/key.names';

import {
  RFQ_NAMESPACE,
  RFQ_NAMESPACE_PARTS,
  RFQ_COMBO_NAMESPACE_PARTS,
  CONTROLS_NAMESPACE,
  AUTH_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_PARTS_SET_STATE,
  RFQ_PARTS_SAVE_DESCRIPTIONS,
  RFQ_PARTS_SET_PART_NUMBER_FOR_HISTORY,
  RFQ_PARTS_SET_PART_PROPERTY,
  RFQ_PARTS_SET_FLAG,
} from '@/store/modules/rfq/mutation.types';
import { RFQ_PARTS_ACTION_VALIDATE_PART, RFQ_ACTION_GET_PART_INFO } from '@/store/modules/rfq/action.types';
import { historyKeyNames, partKeyNames, rfqKeyNames } from '@/store/modules/rfq/key.names';
import { saleTypes } from '@/store/modules/controls/controls.store';

import { SvgSprite, BlockCollapse } from '@/components/gui';
import { DialogAddPartConverterUOM } from '@/components/common/index';
import { iconCheckSprite, iconArrowSprite, iconHazmatSprite, iconAttentionRedSprite } from 'svg';

import newHistoryMixin from '../mixins/history-new.mixin';
import validateMixin from '../mixins/validation.mixin';
import offerMixin from '../mixins/offer.mixin';

export default {
  name: 'RFQPartsBlockRequestLine',
  mixins: [newHistoryMixin, validateMixin, offerMixin],
  props: {
    translate: {
      type: Object,
    },
  },
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-autocomplete': Autocomplete,
    BlockCollapse,
    SvgSprite,
    'dialog-add-part-uom': DialogAddPartConverterUOM,
  },
  beforeCreate() {
    this.partKeys = partKeyNames;
    this.iconCheckSprite = iconCheckSprite;
    this.iconArrowSprite = iconArrowSprite;
    this.iconHazmatSprite = iconHazmatSprite;
    this.iconAttentionRedSprite = iconAttentionRedSprite;
  },
  data() {
    return {
      lastSavedReadyStatus: null,
      autocompleteCallback: null,
      collapsed: false,
      // dialog add part converter uom
      showDialogAddPartConverterUom: false,
      dialogAddPartConverterUomPn: null,
      dialogAddPartConverterUomRates: [],
      dialogAddPartConverterUomMode: true,
      dialogAddPartConverterUomPart: null,
    };
  },
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS, [
      'getPartProperty',
    ]),
    ...mapGetters(CONTROLS_NAMESPACE, [
      'picklists',
    ]),
    isHazmat() {
      return this.getPartProperty({ type: partKeyNames.HISTORY, name: historyKeyNames.IS_HAZMAT, path: historyKeyNames.HAZMAT });
    },
    isAttention() {
      return this.getPartProperty({ type: partKeyNames.HISTORY, name: historyKeyNames.IS_SPECIAL_INFO, path: historyKeyNames.SPECIAL_INFO });
    },
    currentParentPart() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].parentPart;
    },
    selectedPart() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].selectedPart;
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
    attrParent() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PARENT,
      });
    },
    attrPartNumber: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.PART_NUMBER,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.REQUEST,
          name: partKeyNames.PART_NUMBER,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
        this[RFQ_PARTS_SET_PART_NUMBER_FOR_HISTORY](value.toUpperCase());
      },
    },
    attrRequestDescription: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.DESCRIPTION,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.DESCRIPTION,
            value,
          },
          {
            type: partKeyNames.HISTORY,
            name: historyKeyNames.DESCRIPTION,
            value,
          },
        ]);
        this.setFlagNewHistoryMixin();
      },
    },
    attrNsn: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.NSN,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.REQUEST,
          name: partKeyNames.NSN,
          value: !value ? value : value.toUpperCase(),
        });
      },
    },
    attrRequestSalesType: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.SALES_TYPE,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.SALES_TYPE,
            value,
          },
          {
            type: partKeyNames.HISTORY,
            name: historyKeyNames.SALES_TYPE,
            value,
          },
        ]);
        this.setFlagNewHistoryMixin();
      },
    },
    attrRequestQty: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.QTY,
          target: this.currentParentPart,
        });
      },
      set(value) {
        const reqQty = value.replace(/,/g, '.');
        if (!isFinite(value) || value < 1) {
          return;
        }
        const historyQty = this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.QTY,
          target: this.currentParentPart,
        });
        const reqMoq = this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.SALE_OUTRIGHT_MOQ,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
        });
        const convertedReqQty = (+reqQty * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
        const convertedResQty = (+historyQty * this.partUomParamsMixin.multiplier) / this.partUomParamsMixin.divider;
        const convertedResMoq = (+reqMoq * this.requestUomParamsMixin.multiplier) / this.requestUomParamsMixin.divider;
        const result = (+convertedResQty <= +convertedReqQty) ?
          (+convertedResQty * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier :
          (+convertedReqQty * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier;
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.QTY,
            value,
          },
          // {
          //   type: partKeyNames.HISTORY,
          //   name: historyKeyNames.QTY,
          //   value,
          // },
          {
            type: partKeyNames.RESPONSE,
            name: partKeyNames.QTY,
            // value: (+value <= +historyQty) ? +value : +historyQty,
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
            // value: (+value <= +historyQty) ? +value : +historyQty,
            value: (convertedReqQty < convertedResMoq) ?
              (+convertedResMoq * this.requestUomParamsMixin.divider) / this.requestUomParamsMixin.multiplier : result,
          },
        ]);
        // this.setFlagNewHistoryMixin();
      },
    },
    attrRequestUom: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.UOM,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.UOM,
            value,
          },
          // {
          //   type: partKeyNames.HISTORY,
          //   name: historyKeyNames.UOM,
          //   value,
          // },
        ]);
        this[RFQ_PARTS_SET_FLAG]({ name: partKeyNames.FLAG_RECALCULATE_OFFER, value: true });
        this.setFlagNewHistoryMixin();
      },
    },
    attrRequestCage: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.CAGE_CODE,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.CAGE_CODE,
            value,
          },
        ]);
      },
    },
    attrRequestCondition: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.REQUEST,
          name: partKeyNames.CONDITION,
          target: this.currentParentPart,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]([
          {
            type: partKeyNames.REQUEST,
            name: partKeyNames.CONDITION,
            value,
          },
          // {
          //   type: partKeyNames.HISTORY,
          //   name: historyKeyNames.CONDITION,
          //   value,
          // },
        ]);
        this.setFlagNewHistoryMixin();
      },
    },
    attrState: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.STATE,
        });
      },
      set(value) {
        this.$store.commit(getNS([RFQ_COMBO_NAMESPACE_PARTS, RFQ_PARTS_SET_STATE]), value);
      },
    },
    attrSalesType() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.SALES_TYPE,
      });
    },
    attrSavedPrice() {
      let price = 0;
      switch (this.attrSalesType) {
        case saleTypes[0].value:
          price = this.getPartProperty({
            type: partKeyNames.RESPONSE,
            name: partKeyNames.SALE_OUTRIGHT_UNIT_PRICE_CONVERTED,
            path: partKeyNames.OFFER_BY_SALES_TYPE,
          });
          break;
        case saleTypes[1].value:
          price = this.getPartProperty({
            type: partKeyNames.RESPONSE,
            name: partKeyNames.SALE_EXCHANGE_EX_FEE_PRICE_CONVERTED,
            path: partKeyNames.OFFER_BY_SALES_TYPE,
          });
          break;
        case saleTypes[2].value:
          price = this.getPartProperty({
            type: partKeyNames.RESPONSE,
            name: partKeyNames.SALE_REPAIR_B_CHECK_PRICE_CONVERTED,
            path: partKeyNames.OFFER_BY_SALES_TYPE,
          });
          break;
        default:
          break;
      }
      if (!price) {
        price = 0;
      }
      return parseFloat(price.toFixed(4));
    },
    stateTypes() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].PART_STATE;
    },
    stateWA: {
      get() {
        return (this.attrState === this.stateTypes[0]) || false;
      },
      set(value) {
        return value;
      },
    },
    stateNQ: {
      get() {
        return (this.attrState === this.stateTypes[1]) || false;
      },
      set(value) {
        return value;
      },
    },
    selectUom() {
      const uomlist = [];
      for (let i = 0; i < this.attrBaseUom.uom.length; i++) {
        uomlist.push(this.attrBaseUom.uom[i].from_uom);
      }
      return uomlist;
    },
    ...mapState(CONTROLS_NAMESPACE, {
      selectCondition: state => state.static[controlsKeyNames.PN_CONDITION],
      // selectUom: state => state.static[controlsKeyNames.UOM],
      selectSalesType: state => state[controlsKeyNames.SALES_TYPE],
    }),
    suggestDescriptions() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].dataDescriptions[this.attrPartNumber];
    },
    currencySymbol() {
      if (!this.$store.state[AUTH_NAMESPACE].configCompany.currency) {
        return null;
      }
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency.currency_symbol;
    },
    requestUomParams() {
      if (!this.attrBaseUom.uom.length) {
        return { multiplier: 1, divider: 1};
      }
      return this.attrBaseUom.uom.find(uom => uom.from_uom === this.attrRequestUom) || { multiplier: 1, divider: 1};
    },
    attrBaseUom() {
      if (!this.$store.state[RFQ_NAMESPACE].partsUom[this.attrPartNumber ? this.attrPartNumber.toUpperCase() : null]) {
        return { base_uom: null, uom: [] };
      }
      return this.$store.state[RFQ_NAMESPACE].partsUom[this.attrPartNumber.toUpperCase()];
    },
    uomToConverted() {
      const uomList = this.getOptions('usageunit');
      return uomList.filter(uom => !this.selectUom.includes(uom));
    },
    ...mapGetters(AUTH_NAMESPACE, [
      'userPrice',
    ]),
  },
  watch: {
    attrPartNumber() {
      if (!this.isValidMixin(partKeyNames.REQUEST, this.currentParentPart)) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: partKeyNames.PART_NUMBER, type: partKeyNames.REQUEST, target: this.currentParentPart });
      }
    },
    attrRequestQty() {
      if (!this.isValidMixin(partKeyNames.REQUEST, this.currentParentPart)) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: partKeyNames.QTY, type: partKeyNames.REQUEST, target: this.currentParentPart });
      }
    },
  },
  methods: {
    getOptions(name) {
      const pickList = this.picklists(name);
      if (pickList === null) {
        return getValueByPath(pickList, name);
      }
      return pickList;
    },
    getDescription(queryString, callback) {
      if (!this.autocompleteCallback) {
        this.autocompleteCallback = callback;
      }
      if (this.suggestDescriptions !== undefined) {
        if (this.suggestDescriptions.length > 0) {
          callback(this.suggestDescriptions);
        } else {
          callback([]);
        }
        return;
      }

      this.$socket.sendObj({
        path: '/v1/catalog/product/description',
        data: {
          response: {
            client: 'vue',
            options: {
              namespace: RFQ_COMBO_NAMESPACE_PARTS,
              mutation: RFQ_PARTS_SAVE_DESCRIPTIONS,
            },
          },
        },
        params: {
          pn: this.attrPartNumber,
        },
      });

      const unwatch = this.$watch('suggestDescriptions', () => {
        callback(this.suggestDescriptions);
        unwatch();
      });
    },
    handleDescriptionSelect(value) {
      this.attrRequestDescription = value;
    },
    clearSuggestions() {
      if (!this.autocompleteCallback) return;
      this.autocompleteCallback([]);
    },
    handleStateChange(e) {
      switch (e.target.value) {
        case this.stateTypes[0]:
          if (e.target.checked) {
            this.stateWA = true;
            this.attrState = e.target.value;
          } else {
            this.stateWA = false;
            this.attrState = null;
          }
          if (this.stateNQ) {
            this.stateNQ = false;
          }
          break;
        case this.stateTypes[1]:
          if (e.target.checked) {
            this.stateNQ = true;
            this.attrState = e.target.value;
          } else {
            this.stateNQ = false;
            this.attrState = null;
          }
          if (this.stateWA) {
            this.stateWA = false;
          }
          break;
        default:
          break;
      }
    },
    handleSalesTypeChange() {
      if (!isFinite(this.attrRequestQty)) {
        return;
      }
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.RESPONSE,
        name: this.qtySalesTypeKey,
        path: partKeyNames.OFFER_BY_SALES_TYPE,
        value: this.attrRequestQty,
      });
      this.setFlagNewHistoryMixin();
    },
    handleAddUOM(uom) {
      this.dialogAddPartConverterUomPn = {
        name: this.attrPartNumber,
        id: this.attrBaseUom.productid,
      };
      this.dialogAddPartConverterUomRates = [
        {
          from_uom: uom,
          to_uom: this.attrBaseUom.base_uom,
        },
      ];
      this.dialogAddPartConverterUomPart = {
        name: this.attrPartNumber,
        id: this.attrBaseUom.productid,
      };
      this.showDialogAddPartConverterUom = true;
    },
    closeDialogAddPartUom(pn, part, uom = null) {
      this.showDialogAddPartConverterUom = false;
      this[RFQ_ACTION_GET_PART_INFO](pn.name);
      if (uom) {
        this.attrRequestUom = uom;
      }
    },
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS, [
      RFQ_PARTS_SET_PART_NUMBER_FOR_HISTORY,
      RFQ_PARTS_ACTION_VALIDATE_PART,
      RFQ_PARTS_SET_PART_PROPERTY,
      RFQ_PARTS_SET_FLAG,
    ]),
    ...mapActions(RFQ_COMBO_NAMESPACE_PARTS, [
      RFQ_PARTS_ACTION_VALIDATE_PART,
    ]),
    ...mapActions(RFQ_NAMESPACE, [
      RFQ_ACTION_GET_PART_INFO,
    ]),
  },
};
</script>
