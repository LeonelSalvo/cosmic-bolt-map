import { memo } from 'react';

const UserInterface = memo(function UserInterface() {
  return (
    <div className="user-interface">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search the cosmos..."
          className="search-input"
        />
        <div className="options-container">
          <button className="option-button">
            <span className="option-icon">⚡</span>
            Quick Search
          </button>
          <button className="option-button">
            <span className="option-icon">🔍</span>
            Advanced
          </button>
          <button className="option-button">
            <span className="option-icon">⭐</span>
            Favorites
          </button>
        </div>
      </div>
    </div>
  );
});

export default UserInterface;