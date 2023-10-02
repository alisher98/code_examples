<template>
    <div class="block rfq-block-offer">
        <div class="block-header block-header--theme rfq-block-header rfq-block-header-row">
          <span>
            {{ translate.RFQ_TITLE_PART_OFFER_BLOCK }}
          </span>
          <span class="rfq-block-header-row-item">
            <div class="rfq-block-header-row-item--block">
              <span class="rfq-block-header-row-item--label">CURRENCY:</span>
              <span class="rfq-block-header-row-item--value">
                <el-select v-model="attrCurrency"
                           :value-key="'currency_name'"
                           :disabled="currentHistoryTab === HISTORY_TYPE.INVENTORY || currentHistoryTab === HISTORY_TYPE.CONSIGNMENT"
                           class="rfq-block-header--input">
                    <el-option v-for="(option, index) in currencyList"
                               :key="index"
                               :value="option"
                               :label="option.currency_name"></el-option>
                </el-select>
              </span>
            </div>
            <div class="rfq-block-header-row-item--block">
              <span class="rfq-block-header-row-item--label">Rate:</span>
              <span class="rfq-block-header-row-item--value">
                <el-input v-model="attrCurrencyRate"
                          class="edit-field-element-ui rfq-block-header--input rfq-block-header--input__rate"
                          :disabled="checkCurrentCurrency"></el-input>
              </span>
            </div>
          </span>
        </div>
        <div class="block-header rfq-block-offer__header delete-top-border-radius">
            <button
              class="btn btn--theme rfq-block-offer__btn"
              id="rfq-offer"
              :disabled="!!selectedHistoryReqSent"
              @click="checkDuplicateOffer">
                {{ translate.RFQ_BUTTON_PART_OFFER_OFFER }}
            </button>
            <button
              class="btn btn--theme rfq-block-offer__btn"
              id="rfq-alt-offer"
              :disabled="!!selectedHistoryReqSent"
              @click="checkDuplicateAltOffer">
                {{ translate.RFQ_BUTTON_PART_OFFER_ALT_OFFER }}
            </button>
            <button
              class="btn btn--theme rfq-block-offer__btn"
              id="rfq-save-pricing"
              @click="handleActionClick(actionTypes[0])">
                {{ translate.RFQ_BUTTON_PART_OFFER_SAVE_PRICING }}
            </button>
            <button
              class="btn btn--theme rfq-block-offer__btn"
              id="rfq-save-offer"
              :disabled="!!selectedHistoryReqSent"
              @click="handleActionClick(actionTypes[1])">
                {{ translate.RFQ_BUTTON_PART_OFFER_SAVE_OFFER }}
            </button>
            <button
              class="btn btn--theme rfq-block-offer__btn"
              id="rfq-save-alt-offer"
              :disabled="!!selectedHistoryReqSent"
              @click="handleActionClick(actionTypes[2])">
                {{ translate.RFQ_BUTTON_PART_OFFER_SAVE_ALT_OFFER }}
            </button>

          <div class="form-checkbox">
            <input v-model="selectedHistoryNq" @change="handleNoQuote" class="form-checkbox__input" type="checkbox" id="no-quote">
            <label id="rfq-nq-line" class="form-checkbox__label" for="no-quote">
              <svg-sprite :icon="iconCheckSprite" class="svg-icon-check form-checkbox__icon"/>
            </label>
            <div class="form-checkbox__text">
              NQ
            </div>
          </div>
          <div class="form-checkbox" v-if="currentHistoryTab === 'manually'">
            <input v-model="selectedHistoryReqSent" class="form-checkbox__input" type="checkbox" id="rfq-requested">
            <label id="rfq-req-line" class="form-checkbox__label" for="rfq-requested">
              <svg-sprite :icon="iconCheckSprite" class="svg-icon-check form-checkbox__icon"/>
            </label>
            <div class="form-checkbox__text">
              Req
            </div>
          </div>
        </div>
        <div class="block-content rfq-block-offer__content">
            <div class="rfq-block-offer__left">
                <component :is="formSalesType" :translate="translate"></component>
            </div>
            <div class="rfq-block-offer__right">
                <div class="form-group webkit-custom-scroll">
                    <label class="form-label rfq-block-offer__label">
                      {{ translate.RFQ_LABEL_PART_OFFER_NOTES }}
                    </label>
                    <textarea
                      v-model.lazy.trim="attrNotes"
                      @change="comparisonWithHistory('attrNotes', $event.target.value)"
                      id="rfq-notes"
                      rows="5"
                      class="form-textarea rfq-block-offer__textarea uppercase">
                    </textarea>
                </div>
                <div class="form-group webkit-custom-scroll">
                    <label class="form-label rfq-block-offer__label">
                      {{ translate.RFQ_LABEL_PART_OFFER_NON_NOTES }}
                    </label>
                    <textarea v-model.lazy.trim="attrNonPrintedNotes" @change="comparisonWithHistory('attrNonPrintedNotes', $event.target.value)"
                              id="rfq-np-notes" rows="5" class="form-textarea rfq-block-offer__textarea uppercase">
                    </textarea>
                </div>
                <div class="form-row rfq-block-offer__row">
                    <div class="form-group rfq-block-offer__group">
                        <label class="form-label rfq-block-offer__label">
<!--                          {{ translate.RFQ_LABEL_PART_OFFER_IC }}-->
                          PMA:
                        </label>
                        <el-select v-model="attrPMA" id="rfq-pma">
                          <el-option
                            v-for="(item, index) in pmaSelect"
                            :key="index"
                            :label="+item ? 'Yes' : 'No'"
                            :value="item">
                          </el-option>
                        </el-select>
                    </div>
<!--                    <div class="form-group rfq-block-offer__group">-->
<!--                        <label class="form-label rfq-block-offer__label">-->
<!--                          {{ translate.RFQ_LABEL_PART_OFFER_V_QUOTE }}-->
<!--                        </label>-->
<!--                        <input v-model.lazy.trim="attrVendorQuote" @change="comparisonWithHistory('attrVendorQuote', $event.target.value)"-->
<!--                               id="rfq-vquote" type="text" class="form-input uppercase">-->
<!--                    </div>-->
                  <div class="form-group rfq-block-offer__group">
                    <label class="form-label rfq-block-offer__label">
                      Integrability:
                    </label>
                    <el-select v-model="attrIntegrability" id="rfq-integrability">
                      <el-option
                        v-for="(item, index) in integrabilitySelect"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="form-row rfq-block-offer__row">
                  <div class="form-group rfq-block-offer__group">
                    <label class="form-label rfq-block-offer__label">
                      {{ translate.RFQ_LABEL_PART_OFFER_V_QUOTE }}
                    </label>
                    <input v-model.lazy.trim="attrVendorQuote" @change="comparisonWithHistory('attrVendorQuote', $event.target.value)"
                           id="rfq-vquote" type="text" class="form-input uppercase">
                  </div>
                </div>
                <div class="form-row rfq-block-offer__row">
                  <div class="form-group rfq-block-offer__group">
                    <label class="form-label rfq-block-offer__label">
                      {{ translate.RFQ_LABEL_PART_OFFER_V_QUOTE_DATE }}
                    </label>
                    <div class="vqdate-group">
                      <el-input
                        v-model.lazy="attrVendorQuoteDate"
                        @change="comparisonWithHistory('attrVendorQuoteDate', $event)"
                        class="vqdate-input"
                        id="rfq-vqdate">
                      </el-input>
                      <el-date-picker
                        class="vqdate-picker"
                        :value-format="dateFormat"
                        :format="dateFormat"
                        v-model="vqdateDatePicker"
                        @change="changeVqdate">
                      </el-date-picker>
                    </div>
                  </div>
                </div>
<!--                <div class="form-group rfq-block-offer__group">-->
<!--                    <label class="form-label rfq-block-offer__label">-->
<!--                      {{ translate.RFQ_LABEL_PART_OFFER_V_QUOTE_DATE }}-->
<!--                    </label>-->
<!--                    <div class="vqdate-group">-->
<!--                        <el-input-->
<!--                          v-model.lazy="attrVendorQuoteDate"-->
<!--                          @change="comparisonWithHistory('attrVendorQuoteDate', $event)"-->
<!--                          class="vqdate-input"-->
<!--                          id="rfq-vqdate">-->
<!--                        </el-input>-->
<!--                        <el-date-picker-->
<!--                          class="vqdate-picker"-->
<!--                          :value-format="dateFormat"-->
<!--                          :format="dateFormat"-->
<!--                          v-model="vqdateDatePicker"-->
<!--                          @change="changeVqdate">-->
<!--                        </el-date-picker>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
      <el-dialog append-to-body
        custom-class="rfq-history-dialog"
        top="40vh"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        :title="dialogTitle"
        @close="handleDialogClose">
          <button class="btn btn--theme rfq-history-dialog__btn"
                  v-loading="loadingOfferBlock"
                  @click="checkDuplicateSaveAndOffer({ edit: true })"
                  :disabled="!flagCanChangeLine">
              {{ translate.RFQ_BUTTON_PART_OFFER_CHANGE_LINE }}
          </button>
          <button class="btn btn--theme rfq-history-dialog__btn"
                  v-loading="loadingOfferBlock"
                  @click="currentHistoryTab === HISTORY_TYPE.INVENTORY || currentHistoryTab === HISTORY_TYPE.CONSIGNMENT ? handleCreateInventoryHistory() : checkDuplicateSaveAndOffer()">
              {{ translate.RFQ_BUTTON_PART_OFFER_CREATE_LINE }}
          </button>
          <button class="btn btn--theme rfq-history-dialog__btn"
                  v-loading="loadingOfferBlock"
                  @click="showDialog = false">
              {{ translate.RFQ_BUTTON_PART_OFFER_CANCEL }}
          </button>
      </el-dialog>
      <el-dialog append-to-body  :visible.sync="showDuplicateDialog" @close="handleDialogCloseDuplicate" custom-class="rfq-duplicate">
          <template slot="title">
            <div class="rfq-duplicate-header">
              {{ translate.RFQ_TITLE_DIALOG_DESCRIPTION }} | {{ translate.RFQ_LABEL_DIALOG_DESCRIPTION_PN }}: {{attrResponsePartNumber}}
            </div>
            <span class="rfq-duplicate-header--info">
              {{ translate.RFQ_TEXT_DIALOG_DESCRIPTION_CAPTION }}
            </span>
          </template>
          <div class="rfq-duplicate__body">
              <div class="rfq-duplicate-recommended">
                  <div class="rfq-duplicate-title">
                      {{ translate.RFQ_LABEL_DIALOG_DESCRIPTION_RECOMMENDED }}
                  </div>
                  <div class="rfq-duplicate-content">
                      <el-radio :label="duplicateOptions[0]" v-model="duplicateRadio" id="rfq-radio-recommended-description">
                          {{recommendedDescription}}
                      </el-radio>
                  </div>
              </div>
              <div class="rfq-duplicate-options" v-if="duplicateOptions.length > 1">
                  <div class="rfq-duplicate-title">
                      {{ translate.RFQ_LABEL_DIALOG_DESCRIPTION_STORED }}
                  </div>
                  <div class="rfq-duplicate-content">
                      <div v-for="(item, key) in duplicateOptions" class="rfq-duplicate-content__row" v-if="key !== 0">
                          <el-radio :label="duplicateOptions[key]" v-model="duplicateRadio" :id="`rfq-radio-stored-description-${key}`">
                              {{item.description}}
                          </el-radio>
                      </div>
                  </div>
              </div>
              <div class="rfq-duplicate-current">
                  <div class="rfq-duplicate-title">
                      {{ translate.RFQ_LABEL_DIALOG_DESCRIPTION_CURRENT }}
                    <div class="rfq-duplicate-note">
                      {{ translate.RFQ_TEXT_DIALOG_DESCRIPTION_NOTE }}
                    </div>
                  </div>
                  <div class="rfq-duplicate-content">
                      <el-radio v-model="duplicateRadio" :label="currentDescription" id="rfq-radio-current-description">
                          {{currentDescription.description}}
                      </el-radio>
                  </div>
              </div>
          </div>
          <div class="rfq-duplicate-footer">
              <button class="btn btn--theme-grey-border" @click="closeDuplicateDialog" id="rfq-button-cancel-description">
                {{ translate.RFQ_BUTTON_DIALOG_DESCRIPTION_CANCEL }}
              </button>
              <button class="btn btn--theme" @click="handleOfferAfterChangeDescription" id="rfq-button-accept-description">
                {{ translate.RFQ_BUTTON_DIALOG_DESCRIPTION_ACCEPT }}
              </button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Select, Option, DatePicker, Dialog, Input, Radio, MessageBox } from 'element-ui';
import EditField from '@/components/gui/edit-field/EditField';
import { saleTypes } from '@/store/modules/controls/controls.store';
import { getNS } from '@/store';
import {
  RFQ_COMBO_NAMESPACE_PARTS,
  RFQ_NAMESPACE,
  RFQ_NAMESPACE_PARTS,
  CONTROLS_NAMESPACE,
  AUTH_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_PARTS_ADD_ALTERNATIVE_PARTS,
  RFQ_PARTS_SET_CURRENT_PART,
  RFQ_PARTS_CLEAR_ATTRIBUTES,
  RFQ_PARTS_SET_READY_DIRECT,
  RFQ_PARTS_SET_FLAG,
  RFQ_PARTS_SET_PART_PROPERTY,
  RFQ_PARTS_CLEAR_OFFER_SALES_TYPE,
  RFQ_PARTS_MAKE_SNAPSHOT,
  RFQ_PARTS_CLEAR_SNAPSHOT,
  RFQ_PARTS_SET_FROM_SNAPSHOT,
  RFQ_INFO_SET_PROPERTY,
  RFQ_PARTS_CHANGE_DESCRIPTION,
  RFQ_SET_LOADING_FLAG,
  RFQ_PARTS_SET_FLAG_NEED_TO_SAVE_NEW_HISTORY,
} from '@/store/modules/rfq/mutation.types';
import {
  RFQ_PARTS_ACTION_VALIDATE_PART,
  RFQ_PARTS_ACTION_CREATE_OR_EDIT_HISTORY,
  // RFQ_PARTS_ACTION_CREATE_OR_EDIT_ALTERNATIVE_HISTORY,
  RFQ_PARTS_ACTION_ADD_OR_REPLACE_HISTORY_ITEM_AND_ALT_OFFER,
  RFQ_ACTION_GET_PART_INFO,
} from '@/store/modules/rfq/action.types';
import config from '@/config';
import { partKeyNames, historyKeyNames, rfqKeyNames } from '@/store/modules/rfq/key.names';
import { controlsKeyNames } from '@/store/modules/controls/key.names';
import { iconCheckSprite } from '@/assets/svg';
import { SvgSprite } from '@/components/gui';

import RFQPartsFormOfferStock from './FormOfferStock';
import RFQPartsFormOfferExchange from './FormOfferExchange';
import RFQPartsFormOfferRepair from './FormOfferRepair';
import RFQPartsFormOfferFlatRate from './FormOfferFlatRate';

import newHistoryMixin from '../mixins/history-new.mixin';
import validateMixin from '../mixins/validation.mixin';
import offerMixin from '../mixins/offer.mixin';

export default {
  name: 'RFQPartsBlockOffer',
  mixins: [newHistoryMixin, validateMixin, offerMixin],
  components: {
    'rfq-form-offer-outright': RFQPartsFormOfferStock,
    'rfq-form-offer-exchange': RFQPartsFormOfferExchange,
    'rfq-form-offer-repair': RFQPartsFormOfferRepair,
    'rfq-form-offer-flatRate': RFQPartsFormOfferFlatRate,
    'el-select': Select,
    'el-option': Option,
    'el-date-picker': DatePicker,
    'el-dialog': Dialog,
    'el-input': Input,
    'el-radio': Radio,
    SvgSprite,
    EditField,
  },
  props: {
    translate: Object,
  },
  beforeCreate() {
    this.dateFormat = config.dateFormat;
    this.actionTypes = ['justSave', 'saveAndOffer', 'saveAndAltOffer'];
    this.iconCheckSprite = iconCheckSprite;
  },
  data() {
    return {
      showDialog: false,
      currentActionType: null,
      vqdateDatePicker: '',
      showDuplicateDialog: false,
      duplicateRadio: '0',
      duplicateOptions: [],
      actionAfterChooseDescription: null,
      newDescription: null,
    };
  },
  computed: {
    ...mapGetters(RFQ_COMBO_NAMESPACE_PARTS, [
      'getPartProperty',
    ]),
    dialogTitle() {
      return this.flagCanChangeLine ? this.translate.RFQ_TITLE_DIALOG_OFFER_CHANGE_CREATE : this.translate.RFQ_TITLE_DIALOG_OFFER_CREATE;
    },
    currentPart() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].selectedPart;
    },
    currentUserId() {
      return this.$store.state[AUTH_NAMESPACE].profile.id;
    },
    selectedHistoryId() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.HISTORY_ID,
      });
    },
    selectedHistoryNq: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NO_QUOTE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NO_QUOTE,
          value: +value,
        });
      },
    },
    selectedHistoryReqSent: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.REQ_SENT,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.REQ_SENT,
          value: +value,
        });
      },
    },
    selectedHistoryUserId() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.USER_ID,
        path: historyKeyNames.USER,
      });
    },
    flagPartNumbersEqual() {
      return this.attrRequestPartNumber === this.attrResponsePartNumber;
    },
    // DO NOT DELETE!
    // flagPartNumbersEqual() {
    //   return this.attrRequestPartNumber === this.attrResponsePartNumber;
    // },
    // flagPartNumbersResolved() {
    //   return (
    //     (this.flagPartNumbersEqual && this.getPartRequestProperty(partKeyNames.PARENT))
    //       || (!this.flagPartNumbersEqual && !this.getPartRequestProperty(partKeyNames.PARENT))
    //       || (this.flagPartNumbersEqual && !this.getPartRequestProperty(partKeyNames.PARENT))
    //   );
    // },
    // flagCanOffer() {
    //   return !!this.selectedHistoryId
    //          && (+this.selectedHistoryId !== +this.attrHistoryId)
    //          && this.flagPartNumbersResolved;
    // },
    // flagCanAddAlternative() {
    //   return this.getPartRequestProperty(partKeyNames.PARENT)
    //   && !this.flagPartNumbersEqual
    //   && !!this.attrRequestPartNumber
    //   && !!this.attrResponsePartNumber;
    // },
    flagNeedToSaveHistory() {
      return this.getPartProperty({
        type: partKeyNames.FLAGS,
        name: partKeyNames.FLAG_CHANGED_HISTORY,
      });
    },
    flagCanChangeLine() {
      return (+this.selectedHistoryUserId === +this.currentUserId) && this.selectedHistoryId !== null && !this.selectedHistoryNq;
    },
    flagHistoryOfferedAndSelectedEqual() {
      return (!!this.selectedHistoryId && !!this.attrHistoryId) && +this.selectedHistoryId === +this.attrHistoryId;
    },
    attrRfqId() {
      return this.$store.state[RFQ_NAMESPACE].body[rfqKeyNames.ID];
    },
    attrRequestPartNumber() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].parentPart[partKeyNames.REQUEST][partKeyNames.PART_NUMBER];
    },
    attrResponsePartNumber() {
      return this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.PART_NUMBER,
      });
    },
    attrSalesType() {
      const salesType = this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.SALES_TYPE,
      });
      return salesType || saleTypes[0].value;
    },
    attrHistoryId() {
      return this.getPartProperty({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.HISTORY_ID,
      });
    },
    attrNotes: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NOTES,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NOTES,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrNonPrintedNotes: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NON_PRINTED_NOTES,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.NON_PRINTED_NOTES,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrVendorQuote: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.VENDOR_QUOTE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.VENDOR_QUOTE,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrVendorQuoteDate: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.VENDOR_QUOTE_DATE,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.VENDOR_QUOTE_DATE,
          value: !value ? value : value.toUpperCase(),
        });
        this.setFlagNewHistoryMixin();
      },
    },
    attrIC: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.IC,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.IC,
          value,
        });
      },
    },
    attrPMA: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.PMA,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.PMA,
          value,
        });
      },
    },
    attrIntegrability: {
      get() {
        return this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: partKeyNames.INTEGRABILITY,
        });
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: partKeyNames.INTEGRABILITY,
          value,
        });
      },
    },
    attrCost() {
      return this.getPartProperty({
        type: partKeyNames.HISTORY,
        name: historyKeyNames.PRICE,
      });
    },
    formSalesType() {
      if (this.attrSalesType) {
        return `rfq-form-offer-${this.attrSalesType}`;
      }
      return 'rfq-form-offer-outright';
    },
    ichgSelect() {
      return this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.IC];
    },
    pmaSelect() {
      return this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.PMA];
    },
    integrabilitySelect() {
      return this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.INTEGRABILITY];
    },
    attrParent() {
      return this.getPartProperty({
        type: partKeyNames.REQUEST,
        name: partKeyNames.PARENT,
      });
    },
    attachHistoryTo() {
      return this.flagPartNumbersEqual ? this.attrResponsePartNumber : [this.attrRequestPartNumber, this.attrResponsePartNumber];
    },
    attrDisqualifiedVendor() {
      return this.currentPart.history.vendor.disqualified;
    },
    currentPartNumber() {
      if (this.selectedHistoryId && this.currentPart.history.pn) {
        return this.currentPart.history.pn;
      }
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyPartNumber;
    },
    currentDescription: {
      get() {
        return {
          description: this.getPartProperty({
            type: partKeyNames.HISTORY,
            name: historyKeyNames.DESCRIPTION,
          }),
        };
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.DESCRIPTION,
          value,
        });
      },
    },
    recommendedDescription() {
      if (this.duplicateOptions.length === 0) {
        return null;
      }
      this.duplicateRadio = this.duplicateOptions[0];
      return this.duplicateOptions[0].description;
    },
    currentHistoryTab() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].historyCurrentTab;
    },
    HISTORY_TYPE() {
      return this.$store.state[RFQ_NAMESPACE][RFQ_NAMESPACE_PARTS].HISTORY_TYPE;
    },
    loadingOfferBlock() {
      return this.$store.state[RFQ_NAMESPACE].loading.offerBlock;
    },
    currencyList() {
      const list = this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.CURRENCY_LIST];
      list.forEach((currency) => {
        if (!currency.entity_rate) {
          currency.entity_rate = +currency.currency_rate;
        }
      });
      return list;
    },
    attrCurrency: {
      get() {
        const currency = this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.CURRENCY,
        });
        if (currency && !currency.entity_rate) {
          currency.entity_rate = currency.currency_rate;
        }
        if (!currency) {
          this[RFQ_PARTS_SET_PART_PROPERTY]({
            type: partKeyNames.HISTORY,
            name: historyKeyNames.CURRENCY,
            value: { entity_rate: this.companyCurrency.currency_rate, ...this.companyCurrency },
          });
          return { entity_rate: this.companyCurrency.currency_rate, ...this.companyCurrency };
        }
        return currency;
      },
      set(value) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.CURRENCY,
          value,
        });

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
            value: this.calculatePriceOutrightMixin(price, rate),
          });
          // (((price / rate) * this.rfqCurrencyMixin.entity_rate) / value.entity_rate)
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
        this.updateConvertedPrices();
      },
    },
    attrCurrencyRate: {
      get() {
        return +this.getPartProperty({
          type: partKeyNames.HISTORY,
          path: historyKeyNames.CURRENCY,
          name: historyKeyNames.CURRENCY_RATE,
        }) || 0;
      },
      set(value) {
        this.updateRatePriceMixin(this.rfqCurrencyMixin.entity_rate, +value || 1);
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          path: historyKeyNames.CURRENCY,
          name: historyKeyNames.CURRENCY_RATE,
          value: +value || 0,
        });
        const price = +this.getPartProperty({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
        }) || 0;
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE_CONVERTED,
          value: +value ? (price / value) : 0,
        });

        if (this.attrSalesType === saleTypes[1].value) {
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
            value: +value ? (berCost / value) : 0,
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
            value: +value ? (serviceCost / value) : 0,
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
            value: +value ? (bCheckCost / value) : 0,
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
            value: +value ? (maxRepairCost / value) : 0,
          });
        }
      },
    },
    companyCurrency() {
      return this.$store.state[AUTH_NAMESPACE].configCompany.currency;
    },
    checkCurrentCurrency() {
      if (this.attrCurrency) {
        return this.attrCurrency.currency_id === this.companyCurrency.currency_id;
      }
      return false;
    },
  },
  watch: {
    attrCost() {
      if (!this.isValidMixin()) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.PRICE });
      }
    },
  },
  methods: {
    changeVqdate(value) {
      this.attrVendorQuoteDate = value;
    },
    checkForDisableVendor() {
      if (this.attrDisqualifiedVendor) {
        this.$notify({
          title: this.translate.RFQ_TITLE_NOTIFY_OFFER_WARN,
          message: this.translate.RFQ_TEXT_NOTIFY_OFFER_VENDOR_OFFER_WARN,
          type: 'warning',
          position: config.notificationPosition,
        });
        return false;
      }
      return true;
    },
    checkHistory() {
      if (!this.selectedHistoryId || this.selectedHistoryNq || this.flagNeedToSaveHistory) {
        let messageError = '';

        if (this.flagNeedToSaveHistory) {
          messageError = this.translate.RFQ_TEXT_NOTIFY_OFFER_HISTORY_WARN;
        }
        if (this.selectedHistoryNq) {
          messageError = this.translate.RFQ_TEXT_NOTIFY_OFFER_NQ_WARN;
        }
        if (!this.selectedHistoryId && !this.flagNeedToSaveHistory) {
          messageError = this.translate.RFQ_TEXT_NOTIFY_OFFER_SELECT_HISTORY_WARN;
        }

        this.$notify({
          title: this.translate.RFQ_TITLE_NOTIFY_OFFER_WARN,
          message: messageError,
          type: 'warning',
          position: config.notificationPosition,
        });
        return false;
      }

      return true;
    },
    checkDuplicateOffer() {
      if (this.attrSalesType === saleTypes[0].value) {
        // this[RFQ_PARTS_ACTION_VALIDATE_PART]({ name: historyKeyNames.VENDOR_MINIMUM_ORDER });
        if (!this.isValidMixin()) {
          let errorMessage = '';
          const validationResults = this.validationResultsMixin(partKeyNames.HISTORY);
          const validationRules = this.validationRulesMixin(partKeyNames.HISTORY);
          Object.keys(validationResults).forEach((key) => {
            if (!validationResults[key]) {
              errorMessage += `${validationRules[key].message}<br>`;
            }
          });
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_ERROR,
            dangerouslyUseHTMLString: true,
            message: errorMessage,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
        }
      }
      if (!this.checkForDisableVendor()) {
        return;
      }
      if (!this.checkHistory()) {
        return;
      }
      if (!this.flagPartNumbersEqual && this.attrParent) {
        this.handleAltOffer({ loadSnapshot: false });
        return;
      }
      if (this.currentPart[partKeyNames.HISTORY][historyKeyNames.CUSTOM_NOTE]) {
        this.handleOffer();
        return;
      }
      this.$socket.sendObj({
        path: '/v1/catalog/product/duplicate',
        data: {
          emit: 'post:duplicates',
        },
        params: {
          pn: this.currentPartNumber,
          description: this.currentDescription.description,
        },
      });
      this.$socketBus.$once('post:duplicates', (payload) => {
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
        if (payload.response.data.descriptions.length === 0 || payload.response.data.valid) {
          if (!payload.response.data.storaged && payload.response.data.valid) {
            this.currentDescription = payload.response.data.valid_value;
            if (this.selectedHistoryId) {
              this.editDescription(payload.response.data.valid_value);
            }
          }
          this.handleOffer();
        } else {
          this.showDuplicateDialog = !this.showDuplicateDialog;
          this.duplicateOptions = payload.response.data.descriptions;
          this.actionAfterChooseDescription = 'offer';
        }
      });
    },
    checkDuplicateAltOffer() {
      if (!this.checkForDisableVendor()) {
        return;
      }
      if (this.currentPart[partKeyNames.HISTORY][historyKeyNames.CUSTOM_NOTE]) {
        this.handleAltOffer({});
        return;
      }
      this.$socket.sendObj({
        path: '/v1/catalog/product/duplicate',
        data: {
          emit: 'post:duplicates',
        },
        params: {
          pn: this.currentPartNumber,
          description: this.currentDescription.description,
        },
      });
      this.$socketBus.$once('post:duplicates', (payload) => {
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
        if (payload.response.data.descriptions.length === 0 || payload.response.data.valid) {
          if (!payload.response.data.storaged && payload.response.data.valid) {
            this.currentDescription = payload.response.data.valid_value;
            if (this.selectedHistoryId) {
              this.editDescription(payload.response.data.valid_value);
            }
          }
          this.handleAltOffer({});
        } else {
          this.showDuplicateDialog = !this.showDuplicateDialog;
          this.duplicateOptions = payload.response.data.descriptions;
          this.actionAfterChooseDescription = 'alt';
        }
      });
    },
    handleCreateInventoryHistory() {
      if (this.attrRfqId) {
        this.checkDuplicateSaveAndOffer();
      } else {
        MessageBox.confirm('Please, save RFQ first.', 'Error', {
          confirmButtonText: 'Ok',
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          customClass: 'rfq-inventory-dialog--error',
          type: 'warning',
        })
          .then(() => {
            this.showDialog = false;
          })
          .catch(() => {});
      }
    },
    checkDuplicateSaveAndOffer({ edit = false } = {}) {
      if (this.currentPart[partKeyNames.HISTORY][historyKeyNames.CUSTOM_NOTE]) {
        !edit ? this.handleHistoryCreate() : this.handleHistoryEdit();
        return;
      }
      this[RFQ_SET_LOADING_FLAG]({ name: 'offerBlock', value: true });
      this.$socket.sendObj({
        path: '/v1/catalog/product/duplicate',
        data: {
          emit: 'post:duplicates',
        },
        params: {
          pn: this.currentPartNumber,
          description: this.currentDescription.description,
        },
      });
      this.$socketBus.$once('post:duplicates', (response) => {
        this.$socketResponse(response).then((payload) => {
          if (payload.response.data.descriptions.length === 0 || payload.response.data.valid) {
            if (!payload.response.data.storaged && payload.response.data.valid) {
              this.currentDescription = payload.response.data.valid_value;
              if (this.selectedHistoryId) {
                this.editDescription(payload.response.data.valid_value);
              }
            }
            !edit ? this.handleHistoryCreate() : this.handleHistoryEdit();
          } else {
            this.showDuplicateDialog = !this.showDuplicateDialog;
            this.duplicateOptions = payload.response.data.descriptions;
            this.actionAfterChooseDescription = !edit ? 'create' : 'edit';
          }
        }).catch(() => {});
      });
    },
    closeDuplicateDialog() {
      this.showDuplicateDialog = !this.showDuplicateDialog;
      this.duplicateOptions = [];
      this.actionAfterChooseDescription = null;
      this[RFQ_SET_LOADING_FLAG]({ name: 'offerBlock', value: false });
    },
    handleOfferAfterChangeDescription() {
      if (this.duplicateRadio.description === this.currentDescription.description) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          target: this.currentPart,
          type: partKeyNames.HISTORY,
          name: historyKeyNames.CUSTOM_NOTE,
          value: 1,
        });
      }
      if (this.currentHistoryTab !== 'ilsV2' && this.selectedHistoryId) {
        this.$socket.sendObj({
          path: '/v1/rfq/history/description',
          data: {
            emit: 'post:editDescription',
          },
          params: {
            hid: this.selectedHistoryId,
            description: this.duplicateRadio.description,
          },
        });
        this.$socketBus.$once('post:editDescription', (response) => {
          this.$socketResponse(response).then((payload) => {
            this.newDescription = payload.response.data;
            this.actionAfterDuplicateOffer();
            this.showDuplicateDialog = !this.showDuplicateDialog;
            this.duplicateOptions = [];
            this.actionAfterChooseDescription = null;
          }).catch(() => {});
        });
      } else {
        this.newDescription = { hid: null, noun: this.duplicateRadio.description };
        this.actionAfterDuplicateOffer();
        this.closeDuplicateDialog();
      }
    },
    actionAfterDuplicateOffer() {
      switch (this.actionAfterChooseDescription) {
        case 'offer':
          this[RFQ_PARTS_CHANGE_DESCRIPTION](this.newDescription);
          this.handleOffer();
          break;
        case 'alt':
          this[RFQ_PARTS_CHANGE_DESCRIPTION](this.newDescription);
          this.handleAltOffer({});
          break;
        case 'edit':
          this.currentDescription = this.newDescription.noun;
          this.handleHistoryEdit();
          break;
        case 'create':
          this.currentDescription = this.newDescription.noun;
          this.handleHistoryCreate();
          break;
        default:
          break;
      }
    },
    handleOffer() {
      this[RFQ_PARTS_SET_PART_PROPERTY]({
        type: partKeyNames.RESPONSE,
        name: partKeyNames.HISTORY_ID,
        value: this.selectedHistoryId,
      });

      if (!this.isValidMixin(partKeyNames.RESPONSE)) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ type: partKeyNames.RESPONSE });
      }

      this[RFQ_PARTS_SET_READY_DIRECT]({ value: true });
      this[RFQ_PARTS_MAKE_SNAPSHOT]();
    },
    handleAltOffer({ makeClear = this.attrParent, addRequestAttr = this.attrParent, loadSnapshot = true, focus = true }) {
      const reqPn = this.attrRequestPartNumber;

      let flagAltNotes = false;
      const currentHistory = JSON.parse(JSON.stringify(this.currentPart[partKeyNames.HISTORY]));
      if (!currentHistory[historyKeyNames.NOTES] || currentHistory[historyKeyNames.NOTES].toUpperCase().indexOf(`ALT. TO ${this.attrRequestPartNumber}`) === -1) {
        flagAltNotes = true;
      }
      this.$nextTick(() => {
        if (!currentHistory[historyKeyNames.NOTES]) {
          currentHistory[historyKeyNames.NOTES] = '';
        }
        currentHistory[historyKeyNames.NOTES] = ((reqPn !== currentHistory[historyKeyNames.PART_NUMBER]) && flagAltNotes) ? `ALT. TO ${this.attrRequestPartNumber}\n${currentHistory[historyKeyNames.NOTES]}` : currentHistory[historyKeyNames.NOTES];
      });
      const alternative = {
        [partKeyNames.FLAGS]: {},
        [partKeyNames.HISTORY]: currentHistory,
        [partKeyNames.RESPONSE]: Object.assign(
          {},
          JSON.parse(JSON.stringify(this.currentPart[partKeyNames.RESPONSE])),
          {
            [partKeyNames.RESPONSE_ID]: null,
            [partKeyNames.REQUEST_ID]: null,
          },
        ),
      };
      this[RFQ_PARTS_ADD_ALTERNATIVE_PARTS]([alternative]);
      this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_INFO_SET_PROPERTY]), {
        name: rfqKeyNames.STATUS,
        value: this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.STATIC].rfqstatus[0],
      });
      if (this.selectedHistoryId) {
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.RESPONSE,
          name: partKeyNames.HISTORY_ID,
          value: this.selectedHistoryId,
          target: alternative,
        });

        this[RFQ_PARTS_SET_READY_DIRECT]({
          value: true,
          target: alternative,
        });
      } else {
        // this[RFQ_PARTS_SET_FLAG]({
        //   name: partKeyNames.FLAG_CHANGED_HISTORY,
        //   value: true,
        //   target: alternative,
        // });
        //
        this[RFQ_PARTS_SET_PART_PROPERTY]({
          type: partKeyNames.HISTORY,
          name: historyKeyNames.HISTORY_ID,
          value: null,
          target: alternative,
        });

        this[RFQ_PARTS_SET_READY_DIRECT]({
          value: false,
          target: alternative,
        });
      }

      if ((reqPn !== currentHistory[historyKeyNames.PART_NUMBER]) && flagAltNotes) {
        this[RFQ_PARTS_SET_FLAG]({
          name: partKeyNames.FLAG_CHANGED_HISTORY,
          target: alternative,
          value: true,
        });
      }

      this[RFQ_ACTION_GET_PART_INFO](currentHistory[historyKeyNames.PART_NUMBER]);


      // make new alternative snapshot
      this[RFQ_PARTS_MAKE_SNAPSHOT]({ target: alternative });

      // clear parent snapshot
      if (!loadSnapshot) {
        this[RFQ_PARTS_CLEAR_SNAPSHOT]({ target: this.currentPart });
      }

      if (makeClear) {
        this[RFQ_PARTS_CLEAR_ATTRIBUTES]({ addRequestAttr });
      }

      if (loadSnapshot) {
        this[RFQ_PARTS_SET_FROM_SNAPSHOT]();
      }

      if (focus) {
        this[RFQ_PARTS_SET_CURRENT_PART](alternative);
      }
    },
    handleDialogClose() {
      this.currentActionType = null;
    },
    handleDialogCloseDuplicate() {
      this[RFQ_SET_LOADING_FLAG]({ name: 'offerBlock', value: false });
    },
    handleActionClick(actionType) {
      if (actionType !== this.actionTypes[0]) {
        if (!this.checkForDisableVendor()) {
          return;
        }
      }
      if (!this.selectedHistoryNq) {
        this[RFQ_PARTS_ACTION_VALIDATE_PART]({ type: partKeyNames.HISTORY, target: this.currentPart });
      }
      if (!this.isValidMixin()) {
        let errorMessage = '';
        const validationResults = this.validationResultsMixin(partKeyNames.HISTORY);
        const validationRules = this.validationRulesMixin(partKeyNames.HISTORY);
        Object.keys(validationResults).forEach((key) => {
          if (!validationResults[key]) {
            errorMessage += `${validationRules[key].message}<br>`;
          }
        });

        this.$notify({
          title: this.translate.RFQ_TITLE_NOTIFY_ERROR,
          dangerouslyUseHTMLString: true,
          message: errorMessage,
          type: 'error',
          duration: config.notificationErrorDuration,
          position: config.notificationPosition,
        });
        return;
      }

      this.showDialog = true;
      this.currentActionType = actionType;
    },
    handleHistoryCreate() {
      switch (this.currentActionType) {
        case this.actionTypes[0]:
          this.saveOrEditHistory({ loadSnapshot: true });
          break;
        case this.actionTypes[1]:
          if (!this.flagPartNumbersEqual && this.attrParent) {
            this.saveOrEditHistoryAndAltOffer({
              loadSnapshot: false,
            });
          } else {
            this.saveOrEditHistoryAndOffer();
          }
          break;
        case this.actionTypes[2]:
          this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_INFO_SET_PROPERTY]), {
            name: rfqKeyNames.STATUS,
            value: this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.STATIC].rfqstatus[0],
          });
          this.saveOrEditHistoryAndAltOffer();
          break;
        default:
          break;
      }
      this.showDialog = false;
    },
    handleHistoryEdit() {
      switch (this.currentActionType) {
        case this.actionTypes[0]:
          this.saveOrEditHistory({ makeEdit: true, loadSnapshot: !this.flagHistoryOfferedAndSelectedEqual });
          break;
        case this.actionTypes[1]:
          if (!this.flagPartNumbersEqual && this.attrParent) {
            this.saveOrEditHistoryAndAltOffer({
              makeEdit: true,
              loadSnapshot: false,
            });
          } else {
            this.saveOrEditHistoryAndOffer({ makeEdit: true });
          }
          break;
        case this.actionTypes[2]:
          this.$store.commit(getNS([RFQ_NAMESPACE, RFQ_INFO_SET_PROPERTY]), {
            name: rfqKeyNames.STATUS,
            value: this.$store.state[CONTROLS_NAMESPACE][controlsKeyNames.STATIC].rfqstatus[0],
          });
          this.saveOrEditHistoryAndAltOffer({ makeEdit: true });
          break;
        default:
          break;
      }
      this.showDialog = false;
    },
    handleNoQuote(e) {
      if (!e.target.checked) {
        return;
      }
      let deliveryKeyName;

      switch (this.attrSalesType) {
        case saleTypes[1].value:
          deliveryKeyName = partKeyNames.SALE_EXCHANGE_DELIVERY_TIME;
          break;
        case saleTypes[2].value:
          deliveryKeyName = partKeyNames.SALE_REPAIR_DELIVERY_TIME;
          break;
        default:
          deliveryKeyName = partKeyNames.SALE_OUTRIGHT_DELIVERY_TIME;
          break;
      }

      this[RFQ_PARTS_CLEAR_OFFER_SALES_TYPE]({
        salesType: this.attrSalesType,
      });
      this[RFQ_PARTS_SET_PART_PROPERTY]([
        {
          type: partKeyNames.HISTORY,
          name: historyKeyNames.PRICE,
          value: 0,
        },
        {
          type: partKeyNames.HISTORY,
          name: historyKeyNames.LEAD_TIME,
          value: this.translate.RFQ_TEXT_PART_OFFER_NQ,
        },
        {
          type: partKeyNames.RESPONSE,
          name: deliveryKeyName,
          path: partKeyNames.OFFER_BY_SALES_TYPE,
          value: this.translate.RFQ_TEXT_PART_OFFER_NQ,
        },
      ]);

      this[RFQ_PARTS_SET_FLAG]({
        name: partKeyNames.FLAG_VALID_HISTORY,
        value: true,
      });
    },
    saveOrEditHistory({ makeEdit = false, loadSnapshot = false } = {}) {
      this[RFQ_PARTS_ACTION_CREATE_OR_EDIT_HISTORY]({
        attachHistoryTo: this.attachHistoryTo,
        makeEdit,
        loadSnapshot,
        rfqId: this.attrRfqId,
      });
    },
    saveOrEditHistoryAndOffer({ makeEdit = false, makeOffer = true } = {}) {
      this[RFQ_PARTS_ACTION_CREATE_OR_EDIT_HISTORY]({
        attachHistoryTo: this.attachHistoryTo,
        makeOffer,
        makeEdit,
        rfqId: this.attrRfqId,
      });
    },
    saveOrEditHistoryAndAltOffer({ makeEdit = false, makeOffer = true, makeClear = true, loadSnapshot = true } = {}) {
      // clear parent snapshot
      if (!loadSnapshot) {
        this[RFQ_PARTS_CLEAR_SNAPSHOT]({ target: this.currentPart });
      }
      this[RFQ_PARTS_ACTION_CREATE_OR_EDIT_HISTORY]({
        action: RFQ_PARTS_ACTION_ADD_OR_REPLACE_HISTORY_ITEM_AND_ALT_OFFER,
        attachHistoryTo: this.attachHistoryTo,
        makeOffer,
        makeClear,
        loadSnapshot,
        makeEdit,
        rfqId: this.attrRfqId,
      });
    },
    editDescription(description) {
      this.$socket.sendObj({
        path: '/v1/rfq/history/description',
        data: {
          emit: 'post:editDescription',
        },
        params: {
          hid: this.selectedHistoryId,
          description,
        },
      });
      this.$socketBus.$once('post:editDescription', (payload) => {
        if (!payload.response.res) {
          this.$notify({
            title: this.translate.RFQ_TITLE_NOTIFY_ERROR,
            message: payload.response.error,
            type: 'error',
            duration: config.notificationErrorDuration,
            position: config.notificationPosition,
          });
        }
      });
    },
    ...mapMutations(RFQ_COMBO_NAMESPACE_PARTS,
      [
        RFQ_PARTS_SET_PART_PROPERTY,
        RFQ_PARTS_ADD_ALTERNATIVE_PARTS,
        RFQ_PARTS_SET_CURRENT_PART,
        RFQ_PARTS_CLEAR_ATTRIBUTES,
        RFQ_PARTS_SET_READY_DIRECT,
        RFQ_PARTS_ACTION_VALIDATE_PART,
        RFQ_PARTS_SET_FLAG,
        RFQ_PARTS_CLEAR_OFFER_SALES_TYPE,
        RFQ_PARTS_MAKE_SNAPSHOT,
        RFQ_PARTS_CLEAR_SNAPSHOT,
        RFQ_PARTS_SET_FROM_SNAPSHOT,
        RFQ_PARTS_CHANGE_DESCRIPTION,
        RFQ_PARTS_SET_FLAG_NEED_TO_SAVE_NEW_HISTORY,
      ]),
    ...mapActions(RFQ_COMBO_NAMESPACE_PARTS, [
      RFQ_PARTS_ACTION_CREATE_OR_EDIT_HISTORY,
      RFQ_PARTS_ACTION_VALIDATE_PART,
    ]),
    ...mapActions(RFQ_NAMESPACE, [
      RFQ_ACTION_GET_PART_INFO,
    ]),
    ...mapMutations(RFQ_NAMESPACE,
      [
        RFQ_SET_LOADING_FLAG,
      ]),
  },
};
</script>
