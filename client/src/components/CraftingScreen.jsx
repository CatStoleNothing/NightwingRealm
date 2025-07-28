import React, { useState, useEffect } from 'react';
import { CraftingSystem } from '../core/CraftingSystem';
import { ItemSystem } from '../core/Items';
import { slavicStyles } from '../styles/CombatStyles';

export function CraftingScreen({ materials, inventory, onCraft, onClose, playerLevel = 1 }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [craftingResult, setCraftingResult] = useState(null);
  const [availableRecipes, setAvailableRecipes] = useState([]);

  useEffect(() => {
    const recipes = CraftingSystem.getAvailableRecipes(materials, playerLevel);
    setAvailableRecipes(recipes);
  }, [materials, playerLevel]);

  const handleCraft = (recipe) => {
    const result = CraftingSystem.craft(recipe, materials, playerLevel);
    setCraftingResult(result);
    
    if (result.success) {
      onCraft(result.item, result.materials);
    } else {
      onCraft(null, result.materials);
    }
  };

  const renderMaterials = () => {
    return (
      <div style={slavicStyles.panel}>
        <h3 style={slavicStyles.subtitle}>Материалы</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(materials).map(([key, count]) => {
            const material = CraftingSystem.MATERIALS[key];
            if (!material) return null;

            return (
              <div key={key} style={{
                background: slavicStyles.colors.surface,
                border: `2px solid ${slavicStyles.colors.secondary}`,
                borderRadius: '4px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ fontSize: '16px' }}>{material.icon}</span>
                <div>
                  <div style={{ color: slavicStyles.colors.text, fontWeight: 'bold' }}>
                    {material.name}
                  </div>
                  <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                    {count} шт.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRecipes = () => {
    return (
      <div style={slavicStyles.panel}>
        <h3 style={slavicStyles.subtitle}>Рецепты</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {availableRecipes.map((recipe) => (
            <div key={recipe.key} style={{
              background: slavicStyles.colors.surface,
              border: `2px solid ${slavicStyles.colors.secondary}`,
              borderRadius: '4px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedRecipe(recipe)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: slavicStyles.colors.text, fontWeight: 'bold' }}>
                    {recipe.name}
                  </div>
                  <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                    {recipe.description}
                  </div>
                </div>
                <div style={{ color: slavicStyles.colors.accent }}>
                  Сложность: {recipe.difficulty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecipeDetails = () => {
    if (!selectedRecipe) return null;

    const recipeInfo = CraftingSystem.getRecipeInfo(selectedRecipe.key);
    const canCraft = CraftingSystem.canCraft(selectedRecipe, materials);

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: slavicStyles.colors.background,
        border: `3px solid ${slavicStyles.colors.primary}`,
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        maxWidth: '400px',
      }}>
        <h3 style={slavicStyles.subtitle}>{recipeInfo.name}</h3>
        <div style={{ color: slavicStyles.colors.text, marginBottom: '16px' }}>
          {recipeInfo.description}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: slavicStyles.colors.text, fontWeight: 'bold', marginBottom: '8px' }}>
            Требуемые материалы:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recipeInfo.materials.map((material, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: materials[material.name.toLowerCase()] >= material.count 
                  ? slavicStyles.colors.success 
                  : slavicStyles.colors.danger,
              }}>
                <span style={{ fontSize: '16px' }}>{material.icon}</span>
                <span>{material.name}</span>
                <span>{material.count} шт.</span>
                <span>({materials[material.name.toLowerCase()] || 0})</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              ...slavicStyles.button.primary,
              opacity: canCraft ? 1 : 0.5,
            }}
            onClick={() => canCraft && handleCraft(selectedRecipe)}
            disabled={!canCraft}
          >
            Создать
          </button>
          <button
            style={slavicStyles.button.secondary}
            onClick={() => setSelectedRecipe(null)}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  };

  const renderCraftingResult = () => {
    if (!craftingResult) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: slavicStyles.colors.background,
        border: `3px solid ${craftingResult.success ? slavicStyles.colors.success : slavicStyles.colors.danger}`,
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        maxWidth: '400px',
      }}>
        <h3 style={slavicStyles.subtitle}>
          {craftingResult.success ? 'Успех!' : 'Неудача'}
        </h3>
        <div style={{ color: slavicStyles.colors.text, marginBottom: '16px' }}>
          {craftingResult.message}
        </div>
        
        {craftingResult.success && craftingResult.item && (
          <div style={{
            background: slavicStyles.colors.surface,
            border: `2px solid ${craftingResult.item.rarityData?.color || slavicStyles.colors.secondary}`,
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ color: craftingResult.item.rarityData?.color || slavicStyles.colors.text, fontWeight: 'bold' }}>
              {craftingResult.item.name} ({craftingResult.item.rarityData?.name || 'Обычный'})
            </div>
            <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
              {craftingResult.item.description}
            </div>
            {craftingResult.item.damage && <div>Урон: {craftingResult.item.damage}</div>}
            {craftingResult.item.armor && <div>Броня: {craftingResult.item.armor}</div>}
          </div>
        )}

        <button
          style={slavicStyles.button.primary}
          onClick={() => setCraftingResult(null)}
        >
          Понятно
        </button>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: slavicStyles.colors.background,
        border: `3px solid ${slavicStyles.colors.primary}`,
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '800px',
        maxHeight: '600px',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={slavicStyles.title}>Кузница</h2>
          <button
            style={slavicStyles.button.secondary}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {renderMaterials()}
          {renderRecipes()}
        </div>

        {renderRecipeDetails()}
        {renderCraftingResult()}
      </div>
    </div>
  );
} 