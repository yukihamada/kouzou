'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import { WALL_TYPE_LABELS } from '@/lib/constants/wall-base-strength'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useRouter } from 'next/navigation'
import type { WallSegment, WallDirection, WallSpecificationType, JointSpecification } from '@/types/wall'
import { calculateSingleWallStrength } from '@/lib/calc/wall-strength'
import { useAutoSaveNotification } from '@/hooks/use-auto-save-notification'

const wallTypeOptions = Object.entries(WALL_TYPE_LABELS).filter(
  ([key]) => key !== 'none' && key !== 'custom'
)

export function WallSpecForm() {
  const { walls, addWall, removeWall, buildingInfo, nextStep, prevStep, lastSavedAt } =
    useDetailedDiagnosisStore()
  const router = useRouter()
  const floors = buildingInfo.numberOfFloors ?? 1

  useAutoSaveNotification(lastSavedAt)

  const [newWall, setNewWall] = useState<{
    floor: 1 | 2
    direction: WallDirection
    wallType: WallSpecificationType
    length: string
    jointSpec: JointSpecification
    positionX: string
    positionY: string
  }>({
    floor: 1,
    direction: 'X',
    wallType: 'brace_45x90_single',
    length: '1.0',
    jointSpec: 'hardware_complete',
    positionX: '0',
    positionY: '0',
  })

  const handleAdd = () => {
    const length = parseFloat(newWall.length)
    if (isNaN(length) || length <= 0 || length > 100) return

    const wall: WallSegment = {
      id: crypto.randomUUID(),
      floor: newWall.floor,
      direction: newWall.direction,
      wallType: newWall.wallType,
      length,
      height: 2.7,
      jointSpec: newWall.jointSpec,
      positionX: parseFloat(newWall.positionX) || 0,
      positionY: parseFloat(newWall.positionY) || 0,
    }
    addWall(wall)
  }

  const handleNext = () => {
    nextStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push('/detailed/deterioration')
  }

  const handleBack = () => {
    prevStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push('/detailed/floor-plan')
  }

  const getFloorWalls = (floor: 1 | 2) => walls.filter((w) => w.floor === floor)

  const totalStrength = (floor: 1 | 2, dir: WallDirection) =>
    walls
      .filter((w) => w.floor === floor && w.direction === dir)
      .reduce((s, w) => s + calculateSingleWallStrength(w), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>壁の追加</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {floors >= 2 && (
              <div className="space-y-1">
                <Label className="text-xs mb-1 block">階</Label>
                <Select
                  value={String(newWall.floor)}
                  onValueChange={(v) =>
                    setNewWall({ ...newWall, floor: Number(v) as 1 | 2 })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1階</SelectItem>
                    <SelectItem value="2">2階</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">方向</Label>
              <Select
                value={newWall.direction}
                onValueChange={(v) =>
                  setNewWall({ ...newWall, direction: v as WallDirection })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="X">X方向（東西）</SelectItem>
                  <SelectItem value="Y">Y方向（南北）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">壁仕様</Label>
              <Select
                value={newWall.wallType}
                onValueChange={(v) =>
                  setNewWall({
                    ...newWall,
                    wallType: v as WallSpecificationType,
                  })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {wallTypeOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">長さ (m)</Label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={newWall.length}
                onChange={(e) =>
                  setNewWall({ ...newWall, length: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">接合部</Label>
              <Select
                value={newWall.jointSpec}
                onValueChange={(v) =>
                  setNewWall({
                    ...newWall,
                    jointSpec: v as JointSpecification,
                  })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware_complete">
                    金物あり（告示仕様）
                  </SelectItem>
                  <SelectItem value="hardware_partial">金物一部あり</SelectItem>
                  <SelectItem value="nailing_only">釘打ちのみ</SelectItem>
                  <SelectItem value="none">金物なし</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">X位置 (mm)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={newWall.positionX}
                onChange={(e) =>
                  setNewWall({ ...newWall, positionX: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs mb-1 block">Y位置 (mm)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={newWall.positionY}
                onChange={(e) =>
                  setNewWall({ ...newWall, positionY: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={handleAdd} size="sm" className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-1" />
            壁を追加
          </Button>
        </CardContent>
      </Card>

      {[1, ...(floors >= 2 ? [2] : [])].map((floor) => {
        const floorWalls = getFloorWalls(floor as 1 | 2)
        if (floorWalls.length === 0 && floor === 2) return null
        return (
          <Card key={floor}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{floor}階 壁一覧</span>
                <span className="text-sm font-normal text-zinc-500">
                  X: {totalStrength(floor as 1 | 2, 'X').toFixed(1)}kN / Y:{' '}
                  {totalStrength(floor as 1 | 2, 'Y').toFixed(1)}kN
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {floorWalls.length === 0 ? (
                <p className="text-sm text-zinc-400">壁が追加されていません</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>方向</TableHead>
                      <TableHead>壁仕様</TableHead>
                      <TableHead>長さ</TableHead>
                      <TableHead>接合部</TableHead>
                      <TableHead>耐力</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {floorWalls.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>{w.direction}</TableCell>
                        <TableCell className="text-xs">
                          {WALL_TYPE_LABELS[w.wallType]}
                        </TableCell>
                        <TableCell>{w.length}m</TableCell>
                        <TableCell className="text-xs">
                          {w.jointSpec === 'hardware_complete'
                            ? '金物○'
                            : w.jointSpec === 'hardware_partial'
                              ? '金物△'
                              : w.jointSpec === 'nailing_only'
                                ? '釘のみ'
                                : '金物×'}
                        </TableCell>
                        <TableCell>
                          {calculateSingleWallStrength(w).toFixed(2)}kN
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWall(w.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="min-h-[44px]">
          戻る
        </Button>
        <Button onClick={handleNext} disabled={walls.length === 0} className="min-h-[44px]">
          次へ：劣化度調査
        </Button>
      </div>
    </div>
  )
}
