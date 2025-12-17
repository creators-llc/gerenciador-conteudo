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

const currentAnalysis = computed(() => {
    if (
        !apiData.value ||
        !Array.isArray(apiData.value) ||
        apiData.value.length === 0
    ) {
        return null;
    }
    // Pega o array, ordena por 'version' (maior para o menor) e pega o primeiro.
    const sortedData = [...apiData.value].sort((a, b) => b.version - a.version);
    return sortedData[0];
});

const handleUploadSucess = (data: any) => {
    console.log('App recebeu sucesso:', data);
    apiData.value = data;
    errorMessage.value = '';
    showResults.value = true;
    activeTab.value = 'briefing';
};

const handleUploadError = (msg: any) => {
    console.error('App recebeu erro:', msg);
    errorMessage.value =
        typeof msg === 'string' ? msg : 'Erro desconhecido no upload.';
    alert(`Ops! Algo deu errado: ${errorMessage.value}`);
};
</script>

<template>
    <div class="min-h-screen bg-surface p-10">
        <header class="max-w-4xl mx-auto mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800">Creators Agent POC</h1>
            <p class="text-gray-500 mt-2">
                Ambiente de teste de Upload e Feedback
            </p>
        </header>

        <main class="max-w-4xl mx-auto">
            <UploadForm
                @upload-success="handleUploadSucess"
                @upload-error="handleUploadError"
            />

            <div
                v-if="errorMessage"
                class="w-fit mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex justify-center items-start gap-3 animate-fade-in"
            >
                <div>
                    <h4 class="font-bold text-red-800 text-sm">
                        Erro na Operação
                    </h4>
                    <p class="text-red-600 text-sm">{{ errorMessage }}</p>
                </div>
            </div>
        </main>

        <OffCanvas v-model="showResults" placename="Resultado da IA">
            <div class="flex border-b border-gray-200 mb-8 px-2">
                <button
                    @click="activeTab = 'briefing'"
                    :class="
                        activeTab === 'briefing'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                    "
                    class="px-4 py-2 font-medium transition-colors"
                >
                    Briefing
                </button>
                <button
                    @click="activeTab = 'analise'"
                    :class="
                        activeTab === 'analise'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                    "
                    class="px-4 py-2 font-medium transition-colors"
                >
                    Análise
                </button>
            </div>

            <!-- <div v-if="currentAnalysis" class="space-y-6">
                <div v-if="activeTab === 'briefing'" class="animate-fade-in">
                    <h3 class="text-primary font-bold text-lg mb-3">
                        Objetivo / Feedback IA
                    </h3>

                    <div
                        class="mt-6 border border-gray-200 rounded-xl p-6 shadow-sm bg-white"
                    >
                        <p class="text-gray-600 leading-relaxed">
                            {{
                                currentAnalysis.feedback ||
                                'Aguardando análise da inteligência artificial...'
                            }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'analise'"
                    class="animate-fade-in space-y-8"
                >
                    <div>
                        <h4
                            class="text-status-ok font-bold text-lg mb-4 flex items-center gap-2"
                        >
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
                                class="flex flex-col gap-1 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-green-300 transition-colors"
                            >
                                <div class="flex items-start gap-3">
                                    <div class="min-w-5 mt-0.5 text-status-ok">
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
                                                d="M5 13l4 4L19 7"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span
                                        class="text-gray-600 text-sm font-medium"
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum ponto positivo identificado.
                        </p>
                    </div>

                    <div>
                        <h4
                            class="text-status-nok font-bold text-lg mb-4 flex items-center gap-2"
                        >
                            Don't
                        </h4>

                        <div
                            class="space-y-3"
                            v-if="currentAnalysis.checklist?.do?.length"
                        >
                            <div
                                v-for="(
                                    rule, index
                                ) in currentAnalysis.checklist.dont.slice(0, 1)"
                                :key="'dont-' + index"
                                class="flex flex-col gap-1 p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                            >
                                <div class="flex items-start gap-3">
                                    <span
                                        class="text-gray-600 text-sm font-medium"
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum erro crítico detectado.
                        </p>
                    </div>
                </div>
            </div> -->

            <div v-if="currentAnalysis" class="space-y-6">
                <div v-if="activeTab === 'briefing'" class="animate-fade-in">
                    <h3 class="text-primary font-bold text-lg mb-3">
                        Objetivo / Feedback IA
                    </h3>
                    <div
                        class="mt-6 border border-gray-200 rounded-xl p-6 shadow-sm bg-white"
                    >
                        <p class="text-gray-600 leading-relaxed">
                            {{
                                currentAnalysis.feedback ||
                                'Aguardando análise da inteligência artificial...'
                            }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="activeTab === 'analise'"
                    class="animate-fade-in space-y-8"
                >
                    <div>
                        <h4
                            class="text-status-ok font-bold text-lg mb-4 flex items-center gap-2"
                        >
                            Do's
                            <span
                                class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                                >Obrigatórios</span
                            >
                        </h4>

                        <div
                            class="space-y-3"
                            v-if="currentAnalysis.checklist?.do?.length"
                        >
                            <div
                                v-for="(rule, index) in currentAnalysis
                                    .checklist.do"
                                :key="'do-' + index"
                                class="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm transition-colors"
                                :class="
                                    rule.approval
                                        ? 'border-green-200 bg-green-50/30'
                                        : 'border-gray-300 bg-gray-50'
                                "
                            >
                                <div class="flex items-start gap-3 flex-1">
                                    <div
                                        class="min-w-5 mt-0.5"
                                        :class="
                                            rule.approval
                                                ? 'text-status-ok'
                                                : 'text-gray-400'
                                        "
                                    >
                                        <svg
                                            v-if="rule.approval"
                                            class="w-5 h-5"
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
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            ></path>
                                        </svg>
                                    </div>

                                    <span
                                        class="text-sm font-medium"
                                        :class="
                                            rule.approval
                                                ? 'text-gray-800'
                                                : 'text-gray-500'
                                        "
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>

                                <CTooltip
                                    v-if="rule.sintese"
                                    :text="rule.sintese"
                                    position="left"
                                    :show-icon-info="true"
                                />
                            </div>
                        </div>

                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum item obrigatório listado.
                        </p>
                    </div>

                    <div>
                        <h4
                            class="text-status-nok font-bold text-lg mb-4 flex items-center gap-2"
                        >
                            Don't
                            <span
                                class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                                >Evitar</span
                            >
                        </h4>

                        <div
                            class="space-y-3"
                            v-if="currentAnalysis.checklist?.dont?.length"
                        >
                            <div
                                v-for="(rule, index) in currentAnalysis
                                    .checklist.dont"
                                :key="'dont-' + index"
                                class="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm hover:border-red-200 transition-colors"
                            >
                                <div class="flex items-start gap-3 flex-1">
                                    <div class="min-w-5 mt-0.5 text-status-nok">
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
                                    </div>
                                    <span
                                        class="text-gray-600 text-sm font-medium"
                                    >
                                        {{ rule.item }}
                                    </span>
                                </div>

                                <CTooltip
                                    v-if="rule.sintese"
                                    :text="rule.sintese"
                                    position="left"
                                    :show-icon-info="true"
                                />
                            </div>
                        </div>

                        <p
                            v-else
                            class="text-gray-400 italic text-sm border border-dashed border-gray-200 p-4 rounded-lg"
                        >
                            Nenhum erro crítico detectado.
                        </p>
                    </div>
                </div>
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
