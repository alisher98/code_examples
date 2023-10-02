<template>
  <div class="block rfq-block-part-line">
    <div class="block-header rfq-block-header block-header--theme">
      CREATE NEW PART
    </div>
    <div class="block-content">
      <div class="rfq-block-create-part">
        <div class="rfq-block-create-part-row">
          <div class="rfq-block-create-part-row--label">
            Part Number
            <span class="form-label-required"> *</span>
          </div>
          <div class="rfq-block-create-part-row--value">
            <el-input :value="pn" readonly></el-input>
          </div>
        </div>
        <div class="rfq-block-create-part-row">
          <div class="rfq-block-create-part-row--label">
            Description
            <span class="form-label-required"> *</span>
          </div>
          <div class="rfq-block-create-part-row--value">
            <el-input v-model="newPartDescription"></el-input>
          </div>
        </div>
        <div class="rfq-block-create-part-row">
          <div class="rfq-block-create-part-row--label">
            Assigned To
            <span class="form-label-required"> *</span>
          </div>
          <div class="rfq-block-create-part-row--value">
            <el-select v-model="newPartAssignTo" value-key="assigned_name"  filterable placeholder="Assigned To">
              <el-option
                v-for="item in assignedToList"
                :key="item.assigned_id"
                :label="item.assigned_name"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="rfq-block-create-part-row">
          <div class="rfq-block-create-part-row--label">
            Base UOM
            <span class="form-label-required"> *</span>
          </div>
          <div class="rfq-block-create-part-row--value">
            <el-select v-model="newPartBaseUom"
                       filterable
                       placeholder="Base UOM">
              <el-option
                v-for="item in uomList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="rfq-block-create-part--btn">
        <button class="btn btn--theme btn--theme-green" @click="createPart">Create New Part</button>
      </div>
    </div>
  </div>
</template>

<script>

import { Select, Option, Input } from 'element-ui';
import {mapActions, mapGetters} from 'vuex';
import { getValueByPath } from 'element-ui/src/utils/util';
import {
  CONTROLS_NAMESPACE,
  RFQ_NAMESPACE,
} from '@/store/namespaces';
import {
  RFQ_ACTION_GET_PART_INFO,
} from '@/store/modules/rfq/action.types';

export default {
  name: 'BlockCreatePart',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
  },
  props: {
    pn: String,
  },
  created() {
    this.getAssignedToList();
    this.getUomList();
    this.getDefaults();
  },
  data() {
    return {
      newPartAssignTo: {},
      assignedToList: [],
      newPartBaseUom: null,
      uomList: [],
      newPartDescription: null,
    };
  },
  computed: {
    ...mapGetters(CONTROLS_NAMESPACE, [
      'picklists',
    ]),
    attrDefaults() {
      return this.$store.state[RFQ_NAMESPACE].defaults || null;
    },
  },
  methods: {
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
    createPart() {
      this.$socket.sendObj({
        path: '/v1/parts/create',
        data: {
          emit: 'post:createPart',
        },
        params: {
          body: {
            assigned_to: this.newPartAssignTo,
            base_uom: this.newPartBaseUom,
            productname: this.pn,
            description: this.newPartDescription,
            discontinued: 1,
          },
        },
      });
      this.$socketBus.$once('post:createPart', (response) => {
        this.$socketResponse(response).then((payload) => {
          // this[RFQ_ACTION_GET_PART_INFO](payload.response.data.productname);
          this.$emit('part-create');
        }).catch(() => {});
      });
    },
    getAssignedToList() {
      this.$socket.sendObj({
        path: '/v1/list/assigned_to',
        data: {
          emit: 'get:getAssignedToList',
        },
        params: {
        },
      });
      this.$socketBus.$once('get:getAssignedToList', (response) => {
        this.$socketResponse(response).then((payload) => {
          this.assignedToList = payload.response.data;
        }).catch(() => {});
      });
    },
    getUomList() {
      this.uomList = this.getOptions('usageunit');
    },
    getDefaults() {
      if (this.attrDefaults) {
        this.newPartAssignTo = this.attrDefaults.parts_assigned_to;
        this.newPartBaseUom = this.attrDefaults.parts_base_uom;
      }
    },
  },
};
</script>

<style scoped>

</style>
