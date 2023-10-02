<template>
    <BaseListConstructor
      v-if="translateDataMixin"
      namespace="rfq__list"
      moduleName="RFQ"
      listRequestUrl="/v1/rfq/list"
      :title="translateDataMixin.RFQ_TITLE_PAGE_LIST"
      detailRoute="rfq"
      deleteRowUrl="/v1/rfq/delete"
      :actionButtons="actionButtons"
      :listRequestParams="listRequestParams"/>
</template>

<script>

import { BaseListConstructor } from '@/components/gui';
import { translateMixin } from '@/mixins';
import { iconPlusSprite } from 'svg';

export default {
  name: 'ModuleRFQList',
  mixins: [translateMixin],
  components: {
    BaseListConstructor,
  },
  beforeCreate() {
    this.iconPlusSprite = iconPlusSprite;
    this.listRequestParams = {
      scenario: 'pagination',
    };
  },
  created() {
    if (this.$store.getters.socketReady) {
      this.getTranslateMixin({
        module: 'RFQ',
        filter: {
          keys: [
            'RFQ_BUTTON_LIST_ADD_RFQ',
            'RFQ_TITLE_PAGE_LIST',
          ],
        },
      });
    } else {
      const unwatch = this.$watch('$store.getters.socketReady', () => {
        this.getTranslateMixin({
          module: 'RFQ',
          filter: {
            keys: [
              'RFQ_BUTTON_LIST_ADD_RFQ',
              'RFQ_TITLE_PAGE_LIST',
            ],
          },
        });
        unwatch();
      });
    }

    this.$once('translateLoad:success', () => {
      document.title = this.translateDataMixin.RFQ_TITLE_PAGE_LIST;
      this.actionButtons = [
        {
          icon: {
            data: iconPlusSprite,
            class: 'svg-icon-plus svg-icon-plus--white',
          },
          name: this.translateDataMixin.RFQ_BUTTON_LIST_ADD_RFQ,
          id: 'rfq-list-add-btn',
          type: 'router',
          action: '/rfq',
        },
      ];
    });
  },
};
</script>
