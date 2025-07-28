// Система способностей и талантов
export class SkillSystem {
  // Типы способностей
  static SKILL_TYPES = {
    ACTIVE: 'active',
    PASSIVE: 'passive',
    ULTIMATE: 'ultimate'
  };

  // Дерево активных способностей
  static ACTIVE_SKILLS = {
    fireball: {
      id: 'fireball',
      name: 'Огненный шар',
      type: 'active',
      description: 'Запускает огненный шар, наносящий урон по области',
      icon: '🔥',
      damage: 25,
      damageType: 'fire',
      cooldown: 3,
      manaCost: 15,
      range: 3,
      level: 1,
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'burn', duration: 2, chance: 0.3 }]
    },
    lightningStrike: {
      id: 'lightningStrike',
      name: 'Удар молнии',
      type: 'active',
      description: 'Мощная электрическая атака',
      icon: '⚡',
      damage: 30,
      damageType: 'electric',
      cooldown: 4,
      manaCost: 20,
      range: 2,
      level: 1,
      maxLevel: 5,
      requirements: [{ skill: 'fireball', level: 2 }],
      effects: [{ type: 'shock', duration: 1, chance: 0.5 }]
    },
    shadowStep: {
      id: 'shadowStep',
      name: 'Теневой шаг',
      type: 'active',
      description: 'Телепортация в тени',
      icon: '👻',
      damage: 0,
      damageType: 'physical',
      cooldown: 6,
      manaCost: 25,
      range: 4,
      level: 1,
      maxLevel: 3,
      requirements: [{ skill: 'lightningStrike', level: 3 }],
      effects: [{ type: 'stealth', duration: 2, chance: 1.0 }]
    },
    dragonBreath: {
      id: 'dragonBreath',
      name: 'Драконье дыхание',
      type: 'ultimate',
      description: 'Мощная огненная атака дракона',
      icon: '🐉',
      damage: 50,
      damageType: 'fire',
      cooldown: 8,
      manaCost: 40,
      range: 3,
      level: 1,
      maxLevel: 3,
      requirements: [{ skill: 'fireball', level: 5 }, { skill: 'lightningStrike', level: 3 }],
      effects: [{ type: 'burn', duration: 4, chance: 0.8 }]
    },
    healingWave: {
      id: 'healingWave',
      name: 'Волна исцеления',
      type: 'active',
      description: 'Восстанавливает здоровье',
      icon: '💚',
      damage: -30, // Отрицательный урон = лечение
      damageType: 'healing',
      cooldown: 5,
      manaCost: 25,
      range: 2,
      level: 1,
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'regeneration', duration: 3, chance: 1.0 }]
    }
  };

  // Дерево пассивных талантов
  static PASSIVE_TALENTS = {
    // Боевые таланты
    weaponMastery: {
      id: 'weaponMastery',
      name: 'Мастерство оружия',
      type: 'passive',
      description: 'Увеличивает урон оружия',
      icon: '⚔️',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'weapon_damage', value: 5, perLevel: true }]
    },
    criticalStrike: {
      id: 'criticalStrike',
      name: 'Критический удар',
      type: 'passive',
      description: 'Увеличивает шанс критического удара',
      icon: '💥',
      maxLevel: 5,
      requirements: [{ talent: 'weaponMastery', level: 2 }],
      effects: [{ type: 'crit_chance', value: 0.05, perLevel: true }]
    },
    armorPenetration: {
      id: 'armorPenetration',
      name: 'Пробивание брони',
      type: 'passive',
      description: 'Игнорирует часть брони врага',
      icon: '🛡️',
      maxLevel: 3,
      requirements: [{ talent: 'criticalStrike', level: 3 }],
      effects: [{ type: 'armor_penetration', value: 0.1, perLevel: true }]
    },

    // Защитные таланты
    toughness: {
      id: 'toughness',
      name: 'Стойкость',
      type: 'passive',
      description: 'Увеличивает максимальное здоровье',
      icon: '❤️',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'max_hp', value: 20, perLevel: true }]
    },
    armorMastery: {
      id: 'armorMastery',
      name: 'Мастерство брони',
      type: 'passive',
      description: 'Увеличивает эффективность брони',
      icon: '🛡️',
      maxLevel: 5,
      requirements: [{ talent: 'toughness', level: 2 }],
      effects: [{ type: 'armor_effectiveness', value: 0.1, perLevel: true }]
    },
    regeneration: {
      id: 'regeneration',
      name: 'Регенерация',
      type: 'passive',
      description: 'Восстанавливает здоровье вне боя',
      icon: '🔄',
      maxLevel: 3,
      requirements: [{ talent: 'armorMastery', level: 3 }],
      effects: [{ type: 'hp_regen', value: 2, perLevel: true }]
    },

    // Магические таланты
    manaMastery: {
      id: 'manaMastery',
      name: 'Мастерство маны',
      type: 'passive',
      description: 'Увеличивает максимальную ману',
      icon: '🔮',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'max_mana', value: 10, perLevel: true }]
    },
    spellPower: {
      id: 'spellPower',
      name: 'Сила заклинаний',
      type: 'passive',
      description: 'Увеличивает урон заклинаний',
      icon: '✨',
      maxLevel: 5,
      requirements: [{ talent: 'manaMastery', level: 2 }],
      effects: [{ type: 'spell_damage', value: 8, perLevel: true }]
    },
    manaRegeneration: {
      id: 'manaRegeneration',
      name: 'Восстановление маны',
      type: 'passive',
      description: 'Увеличивает восстановление маны',
      icon: '🔋',
      maxLevel: 3,
      requirements: [{ talent: 'spellPower', level: 3 }],
      effects: [{ type: 'mana_regen', value: 1, perLevel: true }]
    },

    // Универсальные таланты
    agility: {
      id: 'agility',
      name: 'Ловкость',
      type: 'passive',
      description: 'Увеличивает ловкость',
      icon: '🏃',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'agi', value: 2, perLevel: true }]
    },
    strength: {
      id: 'strength',
      name: 'Сила',
      type: 'passive',
      description: 'Увеличивает силу',
      icon: '💪',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'str', value: 2, perLevel: true }]
    },
    intelligence: {
      id: 'intelligence',
      name: 'Интеллект',
      type: 'passive',
      description: 'Увеличивает интеллект',
      icon: '🧠',
      maxLevel: 5,
      requirements: [],
      effects: [{ type: 'int', value: 2, perLevel: true }]
    }
  };

  // Проверка требований для способности
  static canLearnSkill(skillId, playerSkills, playerTalents) {
    const skill = this.ACTIVE_SKILLS[skillId];
    if (!skill) return false;

    return skill.requirements.every(req => {
      if (req.skill) {
        const playerSkill = playerSkills.find(s => s.id === req.skill);
        return playerSkill && playerSkill.level >= req.level;
      }
      if (req.talent) {
        const playerTalent = playerTalents.find(t => t.id === req.talent);
        return playerTalent && playerTalent.level >= req.level;
      }
      return true;
    });
  }

  // Проверка требований для таланта
  static canLearnTalent(talentId, playerTalents) {
    const talent = this.PASSIVE_TALENTS[talentId];
    if (!talent) return false;

    return talent.requirements.every(req => {
      const playerTalent = playerTalents.find(t => t.id === req.talent);
      return playerTalent && playerTalent.level >= req.level;
    });
  }

  // Изучение способности
  static learnSkill(skillId, playerSkills) {
    const skill = this.ACTIVE_SKILLS[skillId];
    if (!skill) return false;

    const existingSkill = playerSkills.find(s => s.id === skillId);
    if (existingSkill) {
      if (existingSkill.level < skill.maxLevel) {
        existingSkill.level++;
        return true;
      }
      return false;
    } else {
      playerSkills.push({
        id: skillId,
        level: 1,
        cooldownRemaining: 0
      });
      return true;
    }
  }

  // Изучение таланта
  static learnTalent(talentId, playerTalents) {
    const talent = this.PASSIVE_TALENTS[talentId];
    if (!talent) return false;

    const existingTalent = playerTalents.find(t => t.id === talentId);
    if (existingTalent) {
      if (existingTalent.level < talent.maxLevel) {
        existingTalent.level++;
        return true;
      }
      return false;
    } else {
      playerTalents.push({
        id: talentId,
        level: 1
      });
      return true;
    }
  }

  // Применение эффектов талантов к персонажу
  static applyTalentEffects(player, playerTalents) {
    const updatedPlayer = { ...player };

    playerTalents.forEach(playerTalent => {
      const talent = this.PASSIVE_TALENTS[playerTalent.id];
      if (!talent) return;

      talent.effects.forEach(effect => {
        const value = effect.value * playerTalent.level;
        
        switch (effect.type) {
          case 'weapon_damage':
            updatedPlayer.weaponDamage = (updatedPlayer.weaponDamage || 0) + value;
            break;
          case 'crit_chance':
            updatedPlayer.critChance = (updatedPlayer.critChance || 0) + value;
            break;
          case 'armor_penetration':
            updatedPlayer.armorPenetration = (updatedPlayer.armorPenetration || 0) + value;
            break;
          case 'max_hp':
            updatedPlayer.maxHp = (updatedPlayer.maxHp || 100) + value;
            updatedPlayer.hp = Math.min(updatedPlayer.hp, updatedPlayer.maxHp);
            break;
          case 'armor_effectiveness':
            updatedPlayer.armorEffectiveness = (updatedPlayer.armorEffectiveness || 1) + value;
            break;
          case 'hp_regen':
            updatedPlayer.hpRegen = (updatedPlayer.hpRegen || 0) + value;
            break;
          case 'max_mana':
            updatedPlayer.maxMana = (updatedPlayer.maxMana || 20) + value;
            updatedPlayer.mana = Math.min(updatedPlayer.mana, updatedPlayer.maxMana);
            break;
          case 'spell_damage':
            updatedPlayer.spellDamage = (updatedPlayer.spellDamage || 0) + value;
            break;
          case 'mana_regen':
            updatedPlayer.manaRegen = (updatedPlayer.manaRegen || 0) + value;
            break;
          case 'str':
            updatedPlayer.stats.str = (updatedPlayer.stats.str || 10) + value;
            break;
          case 'agi':
            updatedPlayer.stats.agi = (updatedPlayer.stats.agi || 10) + value;
            break;
          case 'int':
            updatedPlayer.stats.int = (updatedPlayer.stats.int || 10) + value;
            break;
        }
      });
    });

    return updatedPlayer;
  }

  // Использование способности
  static useSkill(skillId, player, target, playerSkills) {
    const skill = this.ACTIVE_SKILLS[skillId];
    const playerSkill = playerSkills.find(s => s.id === skillId);
    
    if (!skill || !playerSkill) return { success: false, message: 'Способность не изучена' };
    
    if (playerSkill.cooldownRemaining > 0) {
      return { success: false, message: `Способность на перезарядке (${playerSkill.cooldownRemaining} ходов)` };
    }
    
    if (player.mana < skill.manaCost) {
      return { success: false, message: 'Недостаточно маны' };
    }

    // Применяем способность
    const damage = skill.damage * playerSkill.level;
    const updatedPlayer = { ...player };
    updatedPlayer.mana -= skill.manaCost;
    playerSkill.cooldownRemaining = skill.cooldown;

    // Применяем эффекты к цели
    const updatedTarget = { ...target };
    if (damage > 0) {
      updatedTarget.hp = Math.max(0, updatedTarget.hp - damage);
    } else if (damage < 0) {
      // Лечение
      updatedTarget.hp = Math.min(updatedTarget.maxHp || 100, updatedTarget.hp - damage);
    }

    // Применяем эффекты способности
    if (skill.effects) {
      skill.effects.forEach(effect => {
        if (Math.random() < effect.chance) {
          if (!updatedTarget.effects) updatedTarget.effects = [];
          updatedTarget.effects.push({
            type: effect.type,
            duration: effect.duration,
            value: effect.value || 0
          });
        }
      });
    }

    return {
      success: true,
      message: `Использована способность: ${skill.name}`,
      player: updatedPlayer,
      target: updatedTarget,
      damage: Math.abs(damage),
      skill: skill
    };
  }

  // Обновление перезарядки способностей
  static updateCooldowns(playerSkills) {
    playerSkills.forEach(skill => {
      if (skill.cooldownRemaining > 0) {
        skill.cooldownRemaining--;
      }
    });
  }

  // Получение доступных способностей
  static getAvailableSkills(playerSkills, playerTalents) {
    return Object.keys(this.ACTIVE_SKILLS).filter(skillId => 
      this.canLearnSkill(skillId, playerSkills, playerTalents)
    );
  }

  // Получение доступных талантов
  static getAvailableTalents(playerTalents) {
    return Object.keys(this.PASSIVE_TALENTS).filter(talentId => 
      this.canLearnTalent(talentId, playerTalents)
    );
  }
} 