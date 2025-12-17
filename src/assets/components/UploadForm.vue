<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'upload-success', data: any): void;
    (e: 'upload-error', data: any): void;
}>();

const briefingId = ref('');
const userId = ref('');
const selectedFile = ref<File | null>(null);
const isLoading = ref(false);
const feedbackMessage = ref('');
const feedbackType = ref<'success' | 'error' | ''>('');

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];
    }
};

const submitUpload = async () => {
    // Validação básica
    if (!briefingId.value || !userId.value || !selectedFile.value) {
        feedbackMessage.value =
            'Por favor, preencha todos os campos obrigatórios.';
        feedbackType.value = 'error';
        return;
    }

    isLoading.value = true;
    feedbackMessage.value = '';
    feedbackType.value = '';

    try {
        const formData = new FormData();
        formData.append('file', selectedFile.value);
        formData.append('briefing_id', briefingId.value);
        formData.append('user_id', userId.value);

        const response = await fetch('/api/v1/feedback_agent', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok)
            throw new Error(`Erro na API: ${response.statusText}`);

        console.log('Upload realizado:', data);
        emit('upload-success', data);
        feedbackType.value = 'success';
    } catch (error: any) {
        let errorMsg = 'Falha ao enviar. Tente novamente.';
        try {
            // Tenta extrair mensagem limpa se for JSON
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.detail || parsed.message || errorMsg;
        } catch (e) {
            errorMsg = error.message || errorMsg;
        }

        console.error('Erro no Upload:', error);
        feedbackMessage.value = errorMsg;
        feedbackType.value = 'error';
        emit('upload-error', errorMsg);
    } finally {
        isLoading.value = false;
    }
};

// --- FUNÇÃO DE MOCK PARA TESTES VISUAIS (Apagar antes de subir para produção) ---
const runDevTest = () => {
    console.log('Rodando simulação de API...');

    const mockResponse = [
        {
            briefing_id: 'TESTE-123',
            user_id: 'DEV-TESTER',
            version: 1,
            feedback:
                'Esta é uma resposta simulada para validar o layout. O vídeo parece ótimo, mas faltaram alguns pontos obrigatórios.',
            checklist: {
                do: [
                    {
                        item: 'Item obrigatório FEITO (Deve ter Check Verde)',
                        approval: true,
                        sintese:
                            'A IA detectou que isso foi feito corretamente.',
                    },
                    {
                        item: 'Item obrigatório NÃO FEITO (Deve ter Círculo Cinza)',
                        approval: false,
                        sintese: 'A IA não encontrou este item no vídeo.',
                    },
                    {
                        item: 'Outro item feito (Check Verde)',
                        approval: true,
                        sintese:
                            'A IA detectou que isso foi feito corretamente.',
                    },
                ],
                dont: [
                    {
                        item: 'Item proibido (Deve ser apenas texto, sem ícone)',
                        approval: false,
                        sintese: 'Este item não deve ter ícone de X nem Check.',
                    },
                    {
                        item: 'Outro item proibido',
                        approval: false,
                        sintese: 'Texto explicativo no tooltip.',
                    },
                ],
            },
        },
    ];

    // Simula o sucesso emitindo os dados fake
    emit('upload-success', mockResponse);
};
</script>

<template>
    <div
        class="bg-white p-6 rounded shadow-md border border-gray-200 max-w-lg mx-auto mt-10"
    >
        <h2 class="text-lg font-bold mb-6 text-gray-800 text-center">
            Validação de Conteúdo
        </h2>

        <form @submit.prevent="submitUpload" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    ID do Briefing *
                </label>
                <input
                    v-model="briefingId"
                    type="text"
                    placeholder="Cole o ID aqui..."
                    :disabled="isLoading"
                    class="w-full border text-gray-500 border-gray-300 rounded p-2 focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-100"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    ID do Usuário *
                </label>
                <input
                    v-model="userId"
                    type="text"
                    placeholder="Cole o ID do usuário aqui..."
                    :disabled="isLoading"
                    class="w-full border focus:ring-2 focus:ring-primary outline-none border-gray-300 rounded p-2 bg-gray-50 text-gray-500"
                />
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Vídeo do Criador *</label
                >

                <div class="flex items-center gap-3">
                    <label
                        class="cursor-pointer bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                        Carregar Vídeo
                        <input
                            type="file"
                            accept="video/*"
                            @change="handleFileChange"
                            :disabled="isLoading"
                            class="hidden"
                        />
                    </label>

                    <div
                        v-if="selectedFile"
                        class="flex flex-col overflow-hidden"
                    >
                        <span
                            class="text-sm font-semibold text-gray-700 truncate max-w-50"
                        >
                            {{ selectedFile.name }}
                        </span>
                        <span class="text-xs text-gray-500">
                            {{ (selectedFile.size / 1024 / 1024).toFixed(2) }}
                            MB
                        </span>
                    </div>
                    <span v-else class="text-sm text-gray-400 italic"
                        >Nenhum vídeo selecionado</span
                    >
                </div>
            </div>

            <div
                v-if="feedbackMessage"
                class="rounded-lg p-4 flex items-start gap-3 text-sm transition-all duration-300 animate-fade-in"
                :class="
                    feedbackType === 'success'
                        ? 'text-status-ok'
                        : 'text-status-nok'
                "
            >
                <div class="flex-1">
                    {{ feedbackMessage }}
                </div>
            </div>

            <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-primary text-white font-bold py-3 rounded-lg px-4 hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-md"
            >
                <span v-if="isLoading" class="flex items-center gap-2">
                    <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Enviando...
                </span>
                <span v-else>Enviar para Análise</span>
            </button>
            <button
                type="button"
                @click.prevent="runDevTest"
                class="w-full mb-3 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition border border-gray-300 border-dashed"
            >
                🧪 Testar Layout (Mock)
            </button>

            <!-- <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-primary text-white font-bold py-3 rounded-lg..."
            ></button> -->
        </form>
    </div>
</template>
