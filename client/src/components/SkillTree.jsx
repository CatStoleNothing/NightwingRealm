import React, { useState } from 'react';
import { SkillSystem } from '../core/SkillSystem';
import { Button, Card, Modal, ProgressBar, Icon } from './ModernUI';
import { modernStyles } from './ModernUI';

export function SkillTree({ player, game, onSkillLearned, onTalentLearned }) {
  const [activeTab, setActiveTab] = useState('skills');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);

  const navigationItems = [
    { id: 'skills', label: 'Способности', icon: '⚔️' },
    { id: 'talents', label: 'Таланты', icon: '⭐' }
  ];

  const renderSkillTree = () => {
    const availableSkills = SkillSystem.getAvailableSkills(player.skills, player.talents);
    const learnedSkills = player.skills.map(s => s.id);

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: modernStyles.colors.surface,
          borderRadius: modernStyles.borderRadius.lg,
          border: `1px solid ${modernStyles.colors.border}`
        }}>
          <div>
            <h3 style={{ margin: 0, color: modernStyles.colors.text }}>
              Очки способностей: {player.skillPoints}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: modernStyles.colors.textSecondary }}>
              Изученные способности: {player.skills.length}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          {Object.entries(SkillSystem.ACTIVE_SKILLS).map(([skillId, skill]) => {
            const playerSkill = player.skills.find(s => s.id === skillId);
            const isLearned = learnedSkills.includes(skillId);
            const canLearn = SkillSystem.canLearnSkill(skillId, player.skills, player.talents);
            const hasPoints = player.skillPoints > 0;
            const canUpgrade = isLearned && playerSkill && playerSkill.level < skill.maxLevel;

            return (
              <Card key={skillId}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Icon icon={skill.icon} size="xl" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: modernStyles.colors.text }}>
                      {skill.name}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: modernStyles.colors.textSecondary, fontSize: '0.875rem' }}>
                      {skill.description}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div>
                      <strong>Урон:</strong> {skill.damage}
                    </div>
                    <div>
                      <strong>Тип:</strong> {skill.damageType}
                    </div>
                    <div>
                      <strong>Перезарядка:</strong> {skill.cooldown}
                    </div>
                    <div>
                      <strong>Мана:</strong> {skill.manaCost}
                    </div>
                  </div>
                </div>

                {isLearned && playerSkill && (
                  <div style={{ marginBottom: '1rem' }}>
                    <ProgressBar 
                      value={playerSkill.level} 
                      max={skill.maxLevel} 
                      label={`Уровень ${playerSkill.level}/${skill.maxLevel}`}
                      color="primary"
                    />
                    {playerSkill.cooldownRemaining > 0 && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        color: modernStyles.colors.warning,
                        fontSize: '0.875rem'
                      }}>
                        Перезарядка: {playerSkill.cooldownRemaining} ходов
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isLearned && canLearn && hasPoints && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        if (game.learnSkill(skillId)) {
                          onSkillLearned && onSkillLearned();
                        }
                      }}
                    >
                      Изучить
                    </Button>
                  )}
                  {canUpgrade && hasPoints && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => {
                        if (game.learnSkill(skillId)) {
                          onSkillLearned && onSkillLearned();
                        }
                      }}
                    >
                      Улучшить
                    </Button>
                  )}
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    Подробнее
                  </Button>
                </div>

                {!canLearn && !isLearned && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.light,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem',
                    color: modernStyles.colors.textSecondary
                  }}>
                    Требования не выполнены
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTalentTree = () => {
    const availableTalents = SkillSystem.getAvailableTalents(player.talents);
    const learnedTalents = player.talents.map(t => t.id);

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: modernStyles.colors.surface,
          borderRadius: modernStyles.borderRadius.lg,
          border: `1px solid ${modernStyles.colors.border}`
        }}>
          <div>
            <h3 style={{ margin: 0, color: modernStyles.colors.text }}>
              Очки талантов: {player.talentPoints}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: modernStyles.colors.textSecondary }}>
              Изученные таланты: {player.talents.length}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          {Object.entries(SkillSystem.PASSIVE_TALENTS).map(([talentId, talent]) => {
            const playerTalent = player.talents.find(t => t.id === talentId);
            const isLearned = learnedTalents.includes(talentId);
            const canLearn = SkillSystem.canLearnTalent(talentId, player.talents);
            const hasPoints = player.talentPoints > 0;
            const canUpgrade = isLearned && playerTalent && playerTalent.level < talent.maxLevel;

            return (
              <Card key={talentId}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Icon icon={talent.icon} size="xl" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: modernStyles.colors.text }}>
                      {talent.name}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: modernStyles.colors.textSecondary, fontSize: '0.875rem' }}>
                      {talent.description}
                    </p>
                  </div>
                </div>

                {isLearned && playerTalent && (
                  <div style={{ marginBottom: '1rem' }}>
                    <ProgressBar 
                      value={playerTalent.level} 
                      max={talent.maxLevel} 
                      label={`Уровень ${playerTalent.level}/${talent.maxLevel}`}
                      color="success"
                    />
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: modernStyles.colors.textSecondary }}>
                    <strong>Эффекты:</strong>
                    {talent.effects.map((effect, index) => (
                      <div key={index} style={{ marginTop: '0.25rem' }}>
                        +{effect.value} {effect.type.replace('_', ' ')} за уровень
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isLearned && canLearn && hasPoints && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        if (game.learnTalent(talentId)) {
                          onTalentLearned && onTalentLearned();
                        }
                      }}
                    >
                      Изучить
                    </Button>
                  )}
                  {canUpgrade && hasPoints && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => {
                        if (game.learnTalent(talentId)) {
                          onTalentLearned && onTalentLearned();
                        }
                      }}
                    >
                      Улучшить
                    </Button>
                  )}
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setSelectedTalent(talent)}
                  >
                    Подробнее
                  </Button>
                </div>

                {!canLearn && !isLearned && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.light,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem',
                    color: modernStyles.colors.textSecondary
                  }}>
                    Требования не выполнены
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSkillDetails = () => {
    if (!selectedSkill) return null;

    return (
      <Modal 
        isOpen={!!selectedSkill} 
        onClose={() => setSelectedSkill(null)}
        title={`${selectedSkill.name} - Детали`}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Icon icon={selectedSkill.icon} size="xl" />
            <div>
              <h4 style={{ margin: 0 }}>{selectedSkill.name}</h4>
              <p style={{ margin: '0.25rem 0 0 0', color: modernStyles.colors.textSecondary }}>
                {selectedSkill.description}
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: modernStyles.colors.light,
            borderRadius: modernStyles.borderRadius.lg
          }}>
            <div>
              <strong>Урон:</strong> {selectedSkill.damage}
            </div>
            <div>
              <strong>Тип урона:</strong> {selectedSkill.damageType}
            </div>
            <div>
              <strong>Перезарядка:</strong> {selectedSkill.cooldown} ходов
            </div>
            <div>
              <strong>Стоимость маны:</strong> {selectedSkill.manaCost}
            </div>
            <div>
              <strong>Дальность:</strong> {selectedSkill.range}
            </div>
            <div>
              <strong>Макс. уровень:</strong> {selectedSkill.maxLevel}
            </div>
          </div>

          {selectedSkill.effects && selectedSkill.effects.length > 0 && (
            <div>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>Эффекты:</h5>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedSkill.effects.map((effect, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.surface,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem'
                  }}>
                    <strong>{effect.type}:</strong> {effect.duration} ходов, шанс {Math.floor(effect.chance * 100)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSkill.requirements && selectedSkill.requirements.length > 0 && (
            <div>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>Требования:</h5>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedSkill.requirements.map((req, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.light,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem'
                  }}>
                    {req.skill ? `Способность ${req.skill} уровня ${req.level}` : 
                     req.talent ? `Талант ${req.talent} уровня ${req.level}` : 'Неизвестно'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  const renderTalentDetails = () => {
    if (!selectedTalent) return null;

    return (
      <Modal 
        isOpen={!!selectedTalent} 
        onClose={() => setSelectedTalent(null)}
        title={`${selectedTalent.name} - Детали`}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Icon icon={selectedTalent.icon} size="xl" />
            <div>
              <h4 style={{ margin: 0 }}>{selectedTalent.name}</h4>
              <p style={{ margin: '0.25rem 0 0 0', color: modernStyles.colors.textSecondary }}>
                {selectedTalent.description}
              </p>
            </div>
          </div>

          <div style={{ 
            padding: '1rem',
            backgroundColor: modernStyles.colors.light,
            borderRadius: modernStyles.borderRadius.lg
          }}>
            <div>
              <strong>Макс. уровень:</strong> {selectedTalent.maxLevel}
            </div>
          </div>

          {selectedTalent.effects && selectedTalent.effects.length > 0 && (
            <div>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>Эффекты:</h5>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedTalent.effects.map((effect, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.surface,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem'
                  }}>
                    <strong>{effect.type}:</strong> +{effect.value} за уровень
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTalent.requirements && selectedTalent.requirements.length > 0 && (
            <div>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>Требования:</h5>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedTalent.requirements.map((req, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem',
                    backgroundColor: modernStyles.colors.light,
                    borderRadius: modernStyles.borderRadius.sm,
                    fontSize: '0.875rem'
                  }}>
                    Талант {req.talent} уровня {req.level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Navigation 
        items={navigationItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
      />

      {activeTab === 'skills' && renderSkillTree()}
      {activeTab === 'talents' && renderTalentTree()}

      {renderSkillDetails()}
      {renderTalentDetails()}
    </div>
  );
} 