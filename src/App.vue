<script setup lang="ts">
import { computed, ref } from 'vue';
import UploadForm from './assets/components/UploadForm.vue';
import OffCanvas from './assets/components/OffCanvas.vue';
import CTooltip from './assets/components/CTooltip.vue';

// Estados
const showResults = ref(false);
const activeTab = ref('briefing');
const apiData = ref<any>(null);
const errorMessage = ref('');

// Lógica para pegar a última versão da análise
const currentAnalysis = computed(() => {
    if (
        !apiData.value ||
        !Array.isArray(apiData.value) ||
        apiData.value.length === 0
    ) {
        return null;
    }
    const sortedData = [...apiData.value].sort((a, b) => b.version - a.version);
    return sortedData[0];
});

const handleUploadSuccess = (data: any) => {
    apiData.value = data;
    showResults.value = true;
    activeTab.value = 'briefing';
    errorMessage.value = '';
};

const handleUploadError = (msg: any) => {
    console.error('App recebeu erro:', msg);
    errorMessage.value =
        typeof msg === 'string' ? msg : 'Erro desconhecido no upload.';
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">
        <header class="max-w-4xl mx-auto mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800">Creators Agent POC</h1>
            <p class="text-gray-500 mt-2">
                Ambiente de teste de Upload e Feedback
            </p>
        </header>
        <main class="max-w-4xl mx-auto">
            <UploadForm
                @upload-success="handleUploadSuccess"
                @upload-error="handleUploadError"
            />

            <!-- <div
                v-if="errorMessage"
                class="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-fade-in"
            >
                <span class="text-red-500 text-xl">⚠️</span>
                <div>
                    <h4 class="font-bold text-red-800 text-sm">
                        Erro na Operação
                    </h4>
                    <p class="text-red-600 text-sm">{{ errorMessage }}</p>
                </div>
            </div> -->
        </main>

        <OffCanvas v-model="showResults" placename="Resultado da IA">
            <div class="flex border-b border-gray-200 mb-8 px-2">
                <button
                    @click="activeTab = 'briefing'"
                    class="px-6 py-3 font-semibold text-sm transition-all relative"
                    :class="
                        activeTab === 'briefing'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-gray-600'
                    "
                >
                    Briefing
                    <span
                        v-if="activeTab === 'briefing'"
                        class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
                    ></span>
                </button>
                <button
                    @click="activeTab = 'analise'"
                    class="px-6 py-3 font-semibold text-sm transition-all relative"
                    :class="
                        activeTab === 'analise'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-gray-600'
                    "
                >
                    Análise
                    <span
                        v-if="activeTab === 'analise'"
                        class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
                    ></span>
                </button>
            </div>

            <div v-if="currentAnalysis" class="space-y-6">
                <div v-if="activeTab === 'briefing'" class="animate-fade-in">
                    <h3 class="text-primary font-bold text-lg mb-3">
                        Objetivo / Feedback IA
                    </h3>

                    <div
                        class="mt-6 border border-gray-200 rounded-xl p-6 shadow-sm bg-white"
                    >
                        <p class="text-gray-600 leading-relaxed text-base">
                            {{
                                currentAnalysis.feedback ||
                                'O feedback da IA está sendo processado...'
                            }}
                        </p>
                    </div>

                    <div class="mt-4 text-xs text-gray-400 flex gap-4">
                        <!-- <span>Briefing: {{ currentAnalysis.briefing_id }}</span>
                        <span>User: {{ currentAnalysis.user_id }}</span> -->
                    </div>
                </div>

                <div
                    v-if="activeTab === 'analise'"
                    class="animate-fade-in space-y-8"
                >
                    <div>
                        <h4 class="text-status-ok font-bold text-lg mb-4">
                            Do's
                        </h4>
                        <div
                            class="space-y-3"
                            v-if="currentAnalysis.checklist?.do?.length"
                        >
                            <div
                                v-for="(rule, index) in currentAnalysis
                                    .checklist.do"
                                :key="'do-' + index"
                                class="relative flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm transition-colors"
                                :class="
                                    rule.approval
                                        ? 'border-green-200'
                                        : 'border-gray-200'
                                "
                            >
                                <div class="flex items-start gap-3 flex-1 pr-8">
                                    <div class="mt-0.5 min-w-5">
                                        <svg
                                            v-if="rule.approval"
                                            class="w-5 h-5 text-status-ok"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M5 13l4 4L19 7"
                                            ></path>
                                        </svg>
                                        <svg
                                            v-else
                                            class="w-5 h-5 text-gray-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke-width="2"
                                            ></circle>
                                        </svg>
                                    </div>

                                    <span
                                        class="text-sm font-medium text-gray-700 leading-relaxed"
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>

                                <div class="absolute right-3 top-3">
                                    <CTooltip
                                        v-if="rule.sintese"
                                        :text="rule.sintese"
                                        position="left"
                                        theme="dark"
                                        :show-icon-info="true"
                                    />
                                </div>
                            </div>
                        </div>
                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum item listado.
                        </p>
                    </div>

                    <div>
                        <h4 class="text-status-nok font-bold text-lg mb-4">
                            Don't
                        </h4>
                        <div
                            class="space-y-3"
                            v-if="currentAnalysis.checklist?.dont?.length"
                        >
                            <div
                                v-for="(rule, index) in currentAnalysis
                                    .checklist.dont"
                                :key="'dont-' + index"
                                class="relative flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm"
                            >
                                <div class="flex items-start gap-3 flex-1 pr-8">
                                    <!-- <div class="mt-0.5 min-w-5 text-status-nok">
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                            ></path>
                                        </svg>
                                    </div> -->
                                    <span
                                        class="text-sm font-medium text-gray-700 leading-relaxed"
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>

                                <div class="absolute right-3 top-3">
                                    <CTooltip
                                        v-if="rule.sintese"
                                        :text="rule.sintese"
                                        position="left"
                                        theme="dark"
                                        :show-icon-info="true"
                                    />
                                </div>
                            </div>
                        </div>
                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum item listado.
                        </p>
                    </div>
                </div>
            </div>

            <div v-else class="p-10 text-center text-gray-400">
                <p>Carregando resultados ou nenhum dado recebido...</p>
            </div>
        </OffCanvas>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
