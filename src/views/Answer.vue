<template>
  <div v-if="isLoaded && !error" class="answer">
    <div class="answer__quetion">
      <h1 class="answer__question-title">{{ question.name }}, ответ пользователя <AppUserName :user="answer.author" /></h1>
      <AppCollapsible title="Почитать задание">
        <AppContent :html="question.text" />
      </AppCollapsible>
    </div>
    <AppAnswer :answer="answer" :question="question" class="answer__answer" />
    <AppAnswerEditor
      ref="editor"
      :parent="answer"
      :question="question"
      :disabled="isLoading"
      class="answer__answer-editor"
      @submit="submit"
    />
    <AnswerDiscussion ref="discussion" :answer="answer" :question="question" />
  </div>
  <div v-else-if="error" class="question question__error">
    <h2>Упс, что-то пошло не так <AppHTTPError :exception="error" /></h2>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AppContent from "@/components/AppContent.vue";
import AppHTTPError from "@/components/AppHTTPError.vue";
import AppCollapsible from "@/components/AppCollapsible.vue";
import AppUserName from "@/components/AppUserName.vue";
import AppAnswer from "@/components/homework/AppAnswer.vue";
import AppAnswerEditor from "@/components/homework/AppAnswerEditor.vue";
import AnswerDiscussion from "@/components/Answer/AnswerDiscussion.vue";

export default {
  components: {
    AppContent,
    AppCollapsible,
    AppHTTPError,
    AppAnswer,
    AppAnswerEditor,
    AppUserName,
    AnswerDiscussion,
  },
  data() {
    return {
      isLoaded: false,
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapState("answer", ["question", "answer"]),
    requestedAnswerId() {
      // slug of the requested answer
      const { hash } = this.$route;
      return hash ? hash.split("#")[1] : null;
    },
  },
  watch: {
    async isLoaded(isLoaded) {
      if (isLoaded && this.requestedAnswerId) {
        await this.$nextTick();
        this.scrollToAnswer(this.requestedAnswerId);
      }
    },
  },
  async created() {
    const { id } = this.$route.params;
    this.error = null;
    try {
      await this.FETCH_ANSWER({ id });
    } catch (e) {
      this.error = e;
    }
    this.isLoaded = true;
  },
  methods: {
    ...mapActions("answer", ["FETCH_ANSWER", "POST_ANSWER"]),
    async submit({ text, parent }) {
      const answer = { text, parent, question: this.question.slug };
      this.isLoading = true;
      await this.POST_ANSWER(answer);
      this.isLoading = false;
      this.afterSubmit();
    },
    afterSubmit() {
      this.$refs.editor.clear();
      this.$refs.discussion.scrollToBottom();
    },
    async scrollToAnswer(answerId) {
      const element = document.getElementById(answerId);
      this.$scrollTo(element, 100);
      element.classList.add("answer--highlighted");
    },
  },
};
</script>
