<template>
  <div class="menu-overlay" v-if="show">
    <div class="menu-container">
      <div class="menu-header">
        <h2>Minesweeper Menu</h2>
        <button class="close-btn" @click="closeMenu">×</button>
      </div>
      
      <div class="menu-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <font-awesome-icon :icon="tab.icon" />
          {{ tab.label }}
        </button>
      </div>

      <div class="menu-content">
        <!-- New Game Tab -->
        <div v-if="activeTab === 'newgame'" class="tab-content">
          <h3>Start New Game</h3>
          <DifficultySelector @difficulty-changed="onDifficultyChanged" />
          <div class="action-buttons">
            <button @click="startNewGame" class="primary-btn">
              <font-awesome-icon icon="play" />
              Start Game
            </button>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h3>Settings</h3>
          <div class="settings-group">
            <h4>Game Preferences</h4>
            <div class="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  v-model="settings.autoFlag" 
                  @change="saveSettings"
                >
                Auto-flag when all mines found
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  v-model="settings.showTimer" 
                  @change="saveSettings"
                >
                Show timer
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  v-model="settings.showMineCount" 
                  @change="saveSettings"
                >
                Show mine counter
              </label>
            </div>
          </div>
          <div class="settings-group">
            <h4>Appearance</h4>
            <div class="setting-item">
              <label>Theme:</label>
              <select v-model="settings.theme" @change="saveSettings">
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'" class="tab-content">
          <h3>Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ statistics.gamesPlayed }}</div>
              <div class="stat-label">Games Played</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ statistics.gamesWon }}</div>
              <div class="stat-label">Games Won</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ winPercentage }}%</div>
              <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ formatTime(statistics.bestTime) }}</div>
              <div class="stat-label">Best Time</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ formatTime(statistics.averageTime) }}</div>
              <div class="stat-label">Average Time</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ statistics.currentStreak }}</div>
              <div class="stat-label">Win Streak</div>
            </div>
          </div>
          <div class="stats-actions">
            <button @click="resetStatistics" class="danger-btn">
              <font-awesome-icon icon="trash" />
              Reset Statistics
            </button>
          </div>
        </div>

        <!-- About/Help Tab -->
        <div v-if="activeTab === 'help'" class="tab-content">
          <h3>How to Play</h3>
          <div class="help-content">
            <div class="rule-section">
              <h4><font-awesome-icon icon="target" /> Objective</h4>
              <p>Clear all squares without mines. Numbers show how many mines are adjacent to that square.</p>
            </div>
            
            <div class="rule-section">
              <h4><font-awesome-icon icon="mouse-pointer" /> Controls</h4>
              <ul>
                <li><strong>Left Click:</strong> Reveal a square</li>
                <li><strong>Right Click:</strong> Flag/unflag a square</li>
                <li><strong>Shift + Click:</strong> Temporary flag mode</li>
                <li><strong>Click revealed number:</strong> Auto-reveal adjacent squares if flags match the number</li>
              </ul>
            </div>

            <div class="rule-section">
              <h4><font-awesome-icon icon="lightbulb" /> Tips</h4>
              <ul>
                <li>Start by clicking corners and edges</li>
                <li>Use the numbers to deduce mine locations</li>
                <li>Flag suspected mines to avoid accidents</li>
                <li>Click the smiley face to restart anytime</li>
              </ul>
            </div>

            <div class="rule-section">
              <h4><font-awesome-icon icon="trophy" /> Difficulty Levels</h4>
              <ul>
                <li><strong>Beginner:</strong> 9×9 grid, 10 mines</li>
                <li><strong>Intermediate:</strong> 16×16 grid, 40 mines</li>
                <li><strong>Expert:</strong> 30×16 grid, 99 mines</li>
                <li><strong>Custom:</strong> Define your own grid size and mine count</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DifficultySelector from './DifficultySelector.vue'

export default {
  name: 'GameMenu',
  components: {
    DifficultySelector
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'newgame',
      selectedDifficulty: null,
      tabs: [
        { id: 'newgame', label: 'New Game', icon: 'play' },
        { id: 'settings', label: 'Settings', icon: 'cog' },
        { id: 'stats', label: 'Statistics', icon: 'chart-bar' },
        { id: 'help', label: 'Help', icon: 'question-circle' }
      ],
      settings: {
        autoFlag: false,
        showTimer: true,
        showMineCount: true,
        theme: 'classic'
      },
      statistics: {
        gamesPlayed: 0,
        gamesWon: 0,
        bestTime: 0,
        averageTime: 0,
        totalTime: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    }
  },
  computed: {
    winPercentage() {
      return this.statistics.gamesPlayed > 0 
        ? Math.round((this.statistics.gamesWon / this.statistics.gamesPlayed) * 100)
        : 0;
    }
  },
  methods: {
    closeMenu() {
      this.$emit('close');
    },
    onDifficultyChanged(difficulty) {
      this.selectedDifficulty = difficulty;
    },
    startNewGame() {
      if (this.selectedDifficulty) {
        this.$emit('new-game', this.selectedDifficulty);
        this.closeMenu();
      }
    },
    saveSettings() {
      localStorage.setItem('minesweeper-settings', JSON.stringify(this.settings));
      this.$emit('settings-changed', this.settings);
    },
    loadSettings() {
      const saved = localStorage.getItem('minesweeper-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    },
    loadStatistics() {
      const saved = localStorage.getItem('minesweeper-statistics');
      if (saved) {
        this.statistics = { ...this.statistics, ...JSON.parse(saved) };
      }
    },
    saveStatistics() {
      localStorage.setItem('minesweeper-statistics', JSON.stringify(this.statistics));
    },
    updateStatistics(gameResult) {
      this.statistics.gamesPlayed++;
      
      if (gameResult.won) {
        this.statistics.gamesWon++;
        this.statistics.currentStreak++;
        this.statistics.longestStreak = Math.max(this.statistics.longestStreak, this.statistics.currentStreak);
        
        if (gameResult.time > 0) {
          this.statistics.totalTime += gameResult.time;
          if (this.statistics.bestTime === 0 || gameResult.time < this.statistics.bestTime) {
            this.statistics.bestTime = gameResult.time;
          }
          this.statistics.averageTime = Math.round(this.statistics.totalTime / this.statistics.gamesWon);
        }
      } else {
        this.statistics.currentStreak = 0;
      }
      
      this.saveStatistics();
    },
    resetStatistics() {
      if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
        this.statistics = {
          gamesPlayed: 0,
          gamesWon: 0,
          bestTime: 0,
          averageTime: 0,
          totalTime: 0,
          currentStreak: 0,
          longestStreak: 0
        };
        this.saveStatistics();
      }
    },
    formatTime(seconds) {
      if (seconds === 0) return '--';
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    }
  },
  mounted() {
    this.loadSettings();
    this.loadStatistics();
    // Emit settings on mount to ensure theme is applied
    this.$emit('settings-changed', this.settings);
  }
}
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.menu-container {
  background: #f8f9fa;
  border: 3px solid #808080;
  border-style: outset;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
}

.menu-header {
  background: #c0c0c0;
  padding: 12px 20px;
  border-bottom: 2px solid #808080;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4em;
}

.close-btn {
  background: #c0c0c0;
  border: 2px solid #808080;
  border-style: outset;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #d0d0d0;
}

.close-btn:active {
  border-style: inset;
}

.menu-tabs {
  background: #e0e0e0;
  display: flex;
  border-bottom: 2px solid #808080;
}

.tab-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  border-right: 1px solid #808080;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9em;
  transition: background 0.1s ease;
}

.tab-btn:hover {
  background: #d0d0d0;
}

.tab-btn.active {
  background: #f8f9fa;
  border-bottom: 2px solid #f8f9fa;
  margin-bottom: -2px;
}

.tab-btn:last-child {
  border-right: none;
}

.menu-content {
  padding: 20px;
  max-height: 50vh;
  overflow-y: auto;
}

.tab-content h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  text-align: center;
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.primary-btn {
  background: #007bff;
  color: white;
  border: 2px solid #0056b3;
  border-style: outset;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
}

.primary-btn:hover {
  background: #0056b3;
}

.primary-btn:active {
  border-style: inset;
}

.settings-group {
  margin-bottom: 25px;
}

.settings-group h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.setting-item {
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.setting-item select {
  padding: 4px;
  border: 1px solid #808080;
  border-style: inset;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border: 2px solid #808080;
  border-style: inset;
  padding: 12px;
  text-align: center;
  border-radius: 4px;
}

.stat-number {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  font-family: 'Roboto Mono', monospace;
}

.stat-label {
  font-size: 0.8em;
  color: #666;
  margin-top: 4px;
}

.stats-actions {
  text-align: center;
}

.danger-btn {
  background: #dc3545;
  color: white;
  border: 2px solid #c82333;
  border-style: outset;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
}

.danger-btn:hover {
  background: #c82333;
}

.danger-btn:active {
  border-style: inset;
}

.help-content {
  text-align: left;
}

.rule-section {
  margin-bottom: 20px;
}

.rule-section h4 {
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rule-section p, .rule-section ul {
  margin: 8px 0;
  line-height: 1.5;
}

.rule-section ul {
  padding-left: 20px;
}

.rule-section li {
  margin: 4px 0;
}

/* Theme-specific Menu styles */
.theme-modern .menu-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.theme-modern .menu-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  border-bottom: none;
}

.theme-modern .close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
}

.theme-modern .close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.theme-modern .tab-btn {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 8px 8px 0 0;
  margin: 0 2px;
  transition: all 0.2s ease;
}

.theme-modern .tab-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.theme-modern .tab-btn.active {
  background: white;
  color: #4a5568;
}

.theme-modern .primary-btn {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.theme-modern .stat-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.theme-dark .menu-container {
  background: #2d3748;
  border: 2px solid #4a5568;
  color: #e2e8f0;
}

.theme-dark .menu-header {
  background: #1a202c;
  border-bottom: 2px solid #4a5568;
  color: #e2e8f0;
}

.theme-dark .close-btn {
  background: #4a5568;
  border: 2px solid #2d3748;
  color: #e2e8f0;
}

.theme-dark .close-btn:hover {
  background: #2d3748;
}

.theme-dark .menu-tabs {
  background: #374151;
}

.theme-dark .tab-btn {
  background: #374151;
  color: #d1d5db;
  border-right: 1px solid #4a5568;
}

.theme-dark .tab-btn:hover {
  background: #4b5563;
}

.theme-dark .tab-btn.active {
  background: #2d3748;
  color: #e2e8f0;
  border-bottom: 2px solid #2d3748;
}

.theme-dark .tab-content h3,
.theme-dark .tab-content h4 {
  color: #f7fafc;
}

.theme-dark .settings-group h4 {
  border-bottom: 1px solid #4a5568;
}

.theme-dark .setting-item select,
.theme-dark .setting-item input {
  background: #1a202c;
  border: 1px solid #4a5568;
  color: #e2e8f0;
}

.theme-dark .stat-card {
  background: #374151;
  border: 1px solid #4a5568;
}

.theme-dark .stat-number {
  color: #f7fafc;
}

.theme-dark .stat-label {
  color: #d1d5db;
}

.theme-dark .primary-btn {
  background: #805ad5;
  border: 2px solid #6b46c1;
}

.theme-dark .primary-btn:hover {
  background: #6b46c1;
}

.theme-dark .danger-btn {
  background: #e53e3e;
  border: 2px solid #c53030;
}

.theme-dark .danger-btn:hover {
  background: #c53030;
}

.theme-dark .help-content {
  color: #d1d5db;
}
</style>