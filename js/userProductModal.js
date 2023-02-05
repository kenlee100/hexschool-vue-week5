import config from "./config.js";
export default {
  data() {
    return {
      modal: {},
    };
  },
  props: {
    tempContent: {
      type: Object,
      default: {
        imagesUrl: [],
      },
    },
    addCart: {
      type: Function,
      default() {},
    },
  },
  methods: {
    openModal() {
      console.log("openModal");
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
  },

  template: `
        <div class="modal fade" tabindex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
            <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{ tempContent.title }}</span>
                </h5>
                <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
            </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <img class="img-fluid" :src="tempContent.imageUrl" alt="">
                        </div>
                        <div class="col-sm-6">
                            <span class="badge bg-primary rounded-pill">{{  }}</span>
                            <p>商品描述：{{ tempContent.description }}</p>
                            <p>商品內容：{{ tempContent.content }}</p>
                            <div class="h5">{{ tempContent.price }} 元</div>
                            <del class="h6">原價 {{ tempContent.origin_price }} 元</del>
                            <div class="h5">現在只要 {{ tempContent.price }} 元</div>
                            <div>
                                <!-- 加入購物車 數量 待執行-->
                                <div class="input-group">
                                    <input type="number" class="form-control" min="1" v-model.number="tempContent.qty">
                                    <button type="button" class="btn btn-primary" @click="addCart(tempContent, tempContent.qty)">加入購物車</button>
                                </div>
                            </div>
                        </div>
                            <!-- col-sm-6 end -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
