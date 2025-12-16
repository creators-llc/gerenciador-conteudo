<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'upload-success', data: any): void;
    (e: 'upload-error', data: any): void;
    (e: 'menuOffCanvasOpen', data: true): boolean;
}>();

const briefingId = ref('');
const userId = ref('admin-poc-01'); // MOCKADO por enquanto pois a API exige
const selectedFile = ref<File | null>(null);
const isLoading = ref(false);
const feedbackMessage = ref('');

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];
    }
};

const submitUpload = async () => {
    if (!briefingId.value || !selectedFile.value) {
        alert('Preencha o ID e selecione um arquivo');
        return;
    }
    ('');

    isLoading.value = true;
    feedbackMessage.value = '';

    try {
        // Montagem do Payload conforme o Swagger
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

        console.log('Sucesso:', data);
        emit('upload-success', data);
        emit('menuOffCanvasOpen', data);
        feedbackMessage.value =
            'Upload realizado com sucesso! Verifique o console.';
    } catch (error: any) {
        let errorMsg = error.message;
        try {
            //Teste para mensangem mesmo dando erro
            errorMsg = JSON.parse(error.message);
        } catch (error) {}

        console.error('Erro capturado:', error);
        emit('upload-error', errorMsg);
        feedbackMessage.value = 'Erro ao enviar. Veja os detalhes';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div
        class="bg-white p-6 rounded shadow-md border border-gray-200 max-w-lg mx-auto mt-10"
    >
        <h2 class="text-lg font-bold mb-6 text-gray-800">
            Validação de Conteúdo (POC)
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
                    class="w-full border text-gray-500 border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
                <p class="text-xs text-gray-500 mt-1">
                    o ID que conecta o vídeo as regras da campanha.
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    ID do Usuário (Simulado) *
                </label>
                <input
                    v-model="userId"
                    type="text"
                    :disabled="isLoading"
                    class="w-full border border-gray-300 rounded p-2 bg-gray-50 text-gray-500"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Vídeo do Criador *
                </label>
                <input
                    type="file"
                    accept="video/*"
                    @change="handleFileChange"
                    :disabled="isLoading"
                    class="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-400 hover:file:bg-indigo-600"
                />
                <div
                    v-if="selectedFile"
                    class="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800 flex items-center gap-2"
                >
                    <span class="font-semibold">{{ selectedFile.name }}</span>
                    <span class="text-xs text-gray-500"
                        >({{
                            (selectedFile.size / 1024 / 1024).toFixed(2)
                        }}
                        MB)</span
                    >
                </div>
            </div>

            <div
                v-if="feedbackMessage"
                :class="{
                    'text-': !feedbackMessage.includes('Erro'),
                    'text-red-600': feedbackMessage.includes('Erro'),
                }"
                class="text-sm font-medium"
            >
                {{ feedbackMessage }}
            </div>

            <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-indigo-400 text-white p-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                <span v-if="isLoading">
                    <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                <span v-else> Enviar para Análise </span>
            </button>
        </form>
    </div>
</template>
