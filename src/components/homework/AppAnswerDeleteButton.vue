<template>
  <a v-if="isDeletable" href="#" class="app-answer-delete-button" @click.prevent="del">
    <Icon class="app-answer-delete-button__icon" name="trash-alt" />
  </a>
</template>
<script>
import dayjs from "dayjs";
import { mapActions, mapState } from "vuex";
import "vue-awesome/icons/trash-alt";

export default {
  props: {
    answer: { type: Object, required: true },
    title: { type: String, required: false, default: "удалить" },
  },
  computed: {
    ...mapState("auth", ["user"]),
    isDeletable() {
      return this.authorMatches && this.createdNotTooLongAgo;
    },
    authorMatches() {
      return this.answer.author.uuid == this.user.uuid;
    },
    createdNotTooLongAgo() {
      const created = dayjs(this.answer.created);
      return created.isAfter(dayjs().subtract(30, "minute"));
    },
  },
  methods: {
    ...mapActions("answer", ["DELETE_ANSWER"]),
    async del() {
      if (!confirm("Удаляем?")) {
        return;
      }
      const id = this.answer.slug;
      await this.DELETE_ANSWER({ id });
      this.$emit("deleted");
    },
  },
};
</script>
<style scoped>
.app-answer-delete-button {
  &__icon {
    opacity: 0.6;
  }
}
</style>
