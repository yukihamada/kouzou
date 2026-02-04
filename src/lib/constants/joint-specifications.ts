import type { JointSpecification } from '@/types/wall'

/**
 * 接合部低減係数 Kj
 *
 * 接合部の仕様に応じて壁の耐力を低減する
 * - 告示仕様の金物あり: 低減なし (1.0)
 * - 金物一部あり: やや低減
 * - 釘打ちのみ: 低減
 * - 金物なし: 大きく低減
 */
export const JOINT_REDUCTION_FACTORS: Record<JointSpecification, number> = {
  hardware_complete: 1.0,
  hardware_partial: 0.85,
  nailing_only: 0.7,
  none: 0.5,
}
