<template>
  <div class="difficulty-selector">
    <div class="difficulty-buttons">
      <button 
        v-for="difficulty in predefinedDifficulties" 
        :key="difficulty.name"
        @click="selectDifficulty(difficulty)"
        :class="['difficulty-btn', { active: selectedDifficulty?.name === difficulty.name }]"
      >
        {{ difficulty.name }}
        <span class="difficulty-details">{{ difficulty.width }}×{{ difficulty.height }}, {{ difficulty.mines }} mines</span>
      </button>
      <button 
        @click="toggleCustom"
        :class="['difficulty-btn', { active: showCustom }]"
      >
        Custom
        <span class="difficulty-details" v-if="!showCustom">Define your own</span>
      </button>
    </div>
    
    <div v-if="showCustom" class="custom-settings">
      <div class="custom-inputs">
        <div class="input-group">
          <label>Width:</label>
          <input 
            type="number" 
            v-model.number="customWidth" 
            min="5" 
            max="50" 
            @input="validateCustom"
          >
        </div>
        <div class="input-group">
          <label>Height:</label>
          <input 
            type="number" 
            v-model.number="customHeight" 
            min="5" 
            max="50" 
            @input="validateCustom"
          >
        </div>
        <div class="input-group">
          <label>Mines:</label>
          <input 
            type="number" 
            v-model.number="customMines" 
            :min="1" 
            :max="maxMines" 
            @input="validateCustom"
          >
        </div>
      </div>
      <button 
        @click="applyCustom" 
        :disabled="!isCustomValid"
        class="apply-btn"
      >
        Apply Custom Settings
      </button>
      <div v-if="!isCustomValid" class="validation-error">
        {{ validationMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DifficultySelector',
  data() {
    return {
      predefinedDifficulties: [
        { name: 'Beginner', width: 9, height: 9, mines: 10 },
        { name: 'Intermediate', width: 16, height: 16, mines: 40 },
        { name: 'Expert', width: 30, height: 16, mines: 99 }
      ],
      selectedDifficulty: null,
      showCustom: false,
      customWidth: 12,
      customHeight: 16,
      customMines: 23,
      isCustomValid: true,
      validationMessage: ''
    }
  },
  computed: {
    maxMines() {
      return Math.floor((this.customWidth * this.customHeight) * 0.8);
    }
  },
  methods: {
    selectDifficulty(difficulty) {
      this.selectedDifficulty = difficulty;
      this.showCustom = false;
      this.$emit('difficulty-changed', difficulty);
    },
    toggleCustom() {
      this.showCustom = !this.showCustom;
      if (this.showCustom) {
        this.selectedDifficulty = null;
        this.validateCustom();
      }
    },
    validateCustom() {
      const totalCells = this.customWidth * this.customHeight;
      const maxAllowedMines = Math.floor(totalCells * 0.8);
      
      if (this.customWidth < 5 || this.customHeight < 5) {
        this.isCustomValid = false;
        this.validationMessage = 'Minimum board size is 5×5';
      } else if (this.customWidth > 50 || this.customHeight > 50) {
        this.isCustomValid = false;
        this.validationMessage = 'Maximum board size is 50×50';
      } else if (this.customMines < 1) {
        this.isCustomValid = false;
        this.validationMessage = 'Must have at least 1 mine';
      } else if (this.customMines > maxAllowedMines) {
        this.isCustomValid = false;
        this.validationMessage = `Too many mines. Maximum for ${this.customWidth}×${this.customHeight} is ${maxAllowedMines}`;
      } else {
        this.isCustomValid = true;
        this.validationMessage = '';
      }
    },
    applyCustom() {
      if (this.isCustomValid) {
        const customDifficulty = {
          name: 'Custom',
          width: this.customWidth,
          height: this.customHeight,
          mines: this.customMines
        };
        this.selectedDifficulty = customDifficulty;
        this.$emit('difficulty-changed', customDifficulty);
      }
    }
  },
  mounted() {
    this.selectedDifficulty = this.predefinedDifficulties[0];
    this.$emit('difficulty-changed', this.selectedDifficulty);
  }
}
</script>

<style scoped>
.difficulty-selector {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border: 2px solid #c0c0c0;
  border-style: outset;
  border-radius: 4px;
}

.difficulty-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.difficulty-btn {
  padding: 8px 12px;
  border: 2px solid #808080;
  border-style: outset;
  background: #c0c0c0;
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 110px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 0.9em;
  font-weight: bold;
}

.difficulty-btn:hover {
  background: #d0d0d0;
}

.difficulty-btn:active {
  border-style: inset;
}

.difficulty-btn.active {
  border-style: inset;
  background: #a0a0a0;
  color: #2c3e50;
}

.difficulty-details {
  font-size: 0.75em;
  margin-top: 3px;
  opacity: 0.9;
  font-weight: normal;
}

.custom-settings {
  margin-top: 15px;
  padding: 12px;
  background: #f0f0f0;
  border: 1px solid #808080;
  border-style: inset;
  border-radius: 2px;
}

.custom-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group label {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 0.85em;
  color: #2c3e50;
}

.input-group input {
  width: 60px;
  padding: 4px;
  border: 1px solid #808080;
  border-style: inset;
  background: white;
  text-align: center;
  font-family: 'Roboto Mono', monospace;
}

.apply-btn {
  padding: 6px 16px;
  background: #c0c0c0;
  border: 2px solid #808080;
  border-style: outset;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
}

.apply-btn:hover:not(:disabled) {
  background: #d0d0d0;
}

.apply-btn:active:not(:disabled) {
  border-style: inset;
}

.apply-btn:disabled {
  background: #a0a0a0;
  color: #666;
  cursor: not-allowed;
  border-style: outset;
  opacity: 0.6;
}

.validation-error {
  color: #d73027;
  font-size: 0.8em;
  margin-top: 8px;
  text-align: center;
  font-weight: bold;
}

/* Theme-specific DifficultySelector styles */
.theme-modern .difficulty-selector {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.theme-modern .difficulty-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.theme-modern .difficulty-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.theme-modern .difficulty-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 1px solid #667eea;
}

.theme-modern .custom-settings {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
}

.theme-modern .apply-btn {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.theme-dark .difficulty-selector {
  background: #2d3748;
  border: 2px solid #4a5568;
  color: #e2e8f0;
}

.theme-dark .difficulty-btn {
  background: #4a5568;
  border: 2px solid #2d3748;
  color: #e2e8f0;
}

.theme-dark .difficulty-btn:hover {
  background: #2d3748;
}

.theme-dark .difficulty-btn.active {
  background: #805ad5;
  border: 2px solid #6b46c1;
  color: white;
}

.theme-dark .difficulty-details {
  color: #d1d5db;
}

.theme-dark .custom-settings {
  background: #374151;
  border: 1px solid #4a5568;
}

.theme-dark .input-group label {
  color: #f7fafc;
}

.theme-dark .input-group input {
  background: #1a202c;
  border: 1px solid #4a5568;
  color: #e2e8f0;
}

.theme-dark .apply-btn {
  background: #805ad5;
  border: 2px solid #6b46c1;
  color: white;
}

.theme-dark .apply-btn:hover:not(:disabled) {
  background: #6b46c1;
}

.theme-dark .apply-btn:disabled {
  background: #4a5568;
  color: #a0aec0;
  border: 2px solid #2d3748;
}

.theme-dark .validation-error {
  color: #f56565;
}
</style>