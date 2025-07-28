import React, { useState } from 'react';
import { ItemSystem } from '../core/Items';
import { slavicStyles } from '../styles/CombatStyles';

export function TradeScreen({ game, onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [tradeMode, setTradeMode] = useState('buy'); // 'buy' или 'sell'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Расширенный список предметов для продажи
  const shopItems = [
    // Оружие
    ItemSystem.createItem(ItemSystem.WEAPONS.sword),
    ItemSystem.createItem(ItemSystem.WEAPONS.fireSword),
    ItemSystem.createItem(ItemSystem.WEAPONS.lightningBlade),
    ItemSystem.createItem(ItemSystem.WEAPONS.cursedBlade),
    ItemSystem.createItem(ItemSystem.WEAPONS.dragonBlade),
    
    // Броня
    ItemSystem.createItem(ItemSystem.ARMORS.leather),
    ItemSystem.createItem(ItemSystem.ARMORS.chainmail),
    ItemSystem.createItem(ItemSystem.ARMORS.fireResistant),
    ItemSystem.createItem(ItemSystem.ARMORS.shadowArmor),
    ItemSystem.createItem(ItemSystem.ARMORS.dragonArmor),
    
    // Зелья
    ItemSystem.createItem(ItemSystem.POTIONS.healthPotion),
    ItemSystem.createItem(ItemSystem.POTIONS.staminaPotion),
    ItemSystem.createItem(ItemSystem.POTIONS.firePotion),
    ItemSystem.createItem(ItemSystem.POTIONS.poisonPotion),
    ItemSystem.createItem(ItemSystem.POTIONS.lightningPotion),
    ItemSystem.createItem(ItemSystem.POTIONS.shadowPotion),
  ];

  // Расширенные цены предметов
  const itemPrices = {
    sword: 50,
    fireSword: 150,
    lightningBlade: 300,
    cursedBlade: 500,
    dragonBlade: 1000,
    leather: 40,
    chainmail: 120,
    fireResistant: 200,
    shadowArmor: 400,
    dragonArmor: 800,
    healthPotion: 20,
    staminaPotion: 25,
    firePotion: 80,
    poisonPotion: 60,
    lightningPotion: 100,
    shadowPotion: 150,
  };

  // Система скидок
  const getDiscount = () => {
    const playerLevel = game.player.level;
    if (playerLevel >= 10) return 0.2; // 20% скидка
    if (playerLevel >= 5) return 0.1; // 10% скидка
    return 0;
  };

  const getFinalPrice = (basePrice) => {
    const discount = getDiscount();
    return Math.floor(basePrice * (1 - discount));
  };

  const handleBuy = (item) => {
    const basePrice = itemPrices[item.key] || 50;
    const finalPrice = getFinalPrice(basePrice);
    
    if (game.gold >= finalPrice) {
      setConfirmationData({
        type: 'buy',
        item,
        price: finalPrice,
        action: () => {
          game.buyItem(item, finalPrice);
          setShowConfirmation(false);
          setConfirmationData(null);
        }
      });
      setShowConfirmation(true);
    } else {
      alert('Недостаточно золота!');
    }
  };

  const handleSell = (itemIndex) => {
    const item = game.inventory[itemIndex];
    const price = game.getSellPrice(item);
    
    setConfirmationData({
      type: 'sell',
      item,
      price,
      action: () => {
        game.sellItem(itemIndex, price);
        setShowConfirmation(false);
        setConfirmationData(null);
      }
    });
    setShowConfirmation(true);
  };

  const renderShopItems = () => {
    const discount = getDiscount();
    
    return (
      <div style={slavicStyles.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={slavicStyles.subtitle}>Товары купца</h3>
          {discount > 0 && (
            <div style={{ 
              color: slavicStyles.colors.success, 
              fontWeight: 'bold',
              background: 'rgba(34, 139, 34, 0.2)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Скидка {Math.floor(discount * 100)}%
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {shopItems.map((item, index) => {
            const basePrice = itemPrices[item.key] || 50;
            const finalPrice = getFinalPrice(basePrice);
            const hasDiscount = basePrice !== finalPrice;
            
            return (
              <div key={index} style={{
                background: slavicStyles.colors.surface,
                border: `2px solid ${item.rarityData?.color || slavicStyles.colors.secondary}`,
                borderRadius: '4px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedItem({ item, type: 'shop', index })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <div>
                      <div style={{ color: item.rarityData?.color || slavicStyles.colors.text, fontWeight: 'bold' }}>
                        {item.name}
                      </div>
                      <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                        {item.rarityData?.name || 'Обычный'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {hasDiscount && (
                      <div style={{ 
                        color: slavicStyles.colors.textSecondary, 
                        textDecoration: 'line-through',
                        fontSize: '12px'
                      }}>
                        {basePrice} 🪙
                      </div>
                    )}
                    <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold' }}>
                      {finalPrice} 🪙
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInventory = () => {
    return (
      <div style={slavicStyles.panel}>
        <h3 style={slavicStyles.subtitle}>Ваш инвентарь</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {game.inventory.length === 0 ? (
            <div style={{ color: slavicStyles.colors.textSecondary, textAlign: 'center', padding: '20px' }}>
              Инвентарь пуст
            </div>
          ) : (
            game.inventory.map((item, index) => (
              <div key={index} style={{
                background: slavicStyles.colors.surface,
                border: `2px solid ${item.rarityData?.color || slavicStyles.colors.secondary}`,
                borderRadius: '4px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedItem({ item, type: 'inventory', index })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <div>
                      <div style={{ color: item.rarityData?.color || slavicStyles.colors.text, fontWeight: 'bold' }}>
                        {item.name}
                      </div>
                      <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                        {item.rarityData?.name || 'Обычный'}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold' }}>
                    {game.getSellPrice(item)} 🪙
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderItemDetails = () => {
    if (!selectedItem) return null;

    const { item, type, index } = selectedItem;
    const price = type === 'shop' ? getFinalPrice(itemPrices[item.key] || 50) : game.getSellPrice(item);
    const canAfford = type === 'shop' ? game.gold >= price : true;

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
        <h3 style={slavicStyles.subtitle}>{item.name}</h3>
        <div style={{ color: slavicStyles.colors.text, marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>{item.description}</div>
          <div style={{ color: item.rarityData?.color || slavicStyles.colors.textSecondary }}>
            Редкость: {item.rarityData?.name || 'Обычный'}
          </div>
          {item.damage && <div>Урон: {item.damage}</div>}
          {item.armor && <div>Броня: {item.armor}</div>}
          {item.heal && <div>Восстановление: {item.heal}</div>}
          {item.staminaRestore && <div>Выносливость: {item.staminaRestore}</div>}
        </div>

        <div style={{ 
          color: slavicStyles.colors.accent, 
          fontWeight: 'bold', 
          fontSize: '18px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Цена: {price} 🪙
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {type === 'shop' ? (
            <button
              style={{
                ...slavicStyles.button.primary,
                opacity: canAfford ? 1 : 0.5,
              }}
              onClick={() => canAfford && handleBuy(item)}
              disabled={!canAfford}
            >
              Купить
            </button>
          ) : (
            <button
              style={slavicStyles.button.primary}
              onClick={() => handleSell(index)}
            >
              Продать
            </button>
          )}
          <button
            style={slavicStyles.button.secondary}
            onClick={() => setSelectedItem(null)}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!showConfirmation || !confirmationData) return null;

    const { type, item, price, action } = confirmationData;

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: slavicStyles.colors.background,
        border: `3px solid ${type === 'buy' ? slavicStyles.colors.success : slavicStyles.colors.warning}`,
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1001,
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <h3 style={slavicStyles.subtitle}>
          {type === 'buy' ? 'Подтверждение покупки' : 'Подтверждение продажи'}
        </h3>
        <div style={{ color: slavicStyles.colors.text, marginBottom: '16px' }}>
          {type === 'buy' ? 'Купить' : 'Продать'} {item.name} за {price} 🪙?
        </div>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            style={slavicStyles.button.primary}
            onClick={action}
          >
            Подтвердить
          </button>
          <button
            style={slavicStyles.button.secondary}
            onClick={() => {
              setShowConfirmation(false);
              setConfirmationData(null);
            }}
          >
            Отмена
          </button>
        </div>
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
        maxWidth: '1000px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={slavicStyles.title}>Торговля</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold', fontSize: '18px' }}>
              Золото: {game.gold} 🪙
            </div>
            <button
              style={slavicStyles.button.secondary}
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {renderShopItems()}
          {renderInventory()}
        </div>

        {renderItemDetails()}
        {renderConfirmation()}
      </div>
    </div>
  );
} 