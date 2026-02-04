'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useRouter } from 'next/navigation'

const floorSchema = z.object({
  width: z.number().min(1, '1以上'),
  depth: z.number().min(1, '1以上'),
})

const schema = z.object({
  floor1: floorSchema,
  floor2: floorSchema.optional(),
})

type FormData = z.infer<typeof schema>

export function FloorPlanForm() {
  const { buildingInfo, setBuildingInfo, nextStep, prevStep } =
    useDetailedDiagnosisStore()
  const router = useRouter()
  const floors = buildingInfo.numberOfFloors ?? 1

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      floor1: {
        width: buildingInfo.floorShapes?.floor1?.width
          ? buildingInfo.floorShapes.floor1.width / 1000
          : 10,
        depth: buildingInfo.floorShapes?.floor1?.depth
          ? buildingInfo.floorShapes.floor1.depth / 1000
          : 6,
      },
      floor2:
        floors >= 2
          ? {
              width: buildingInfo.floorShapes?.floor2?.width
                ? buildingInfo.floorShapes.floor2.width / 1000
                : 10,
              depth: buildingInfo.floorShapes?.floor2?.depth
                ? buildingInfo.floorShapes.floor2.depth / 1000
                : 5,
            }
          : undefined,
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form watch() is used intentionally for live preview
  const f1w = watch('floor1.width') || 0
  const f1d = watch('floor1.depth') || 0
  const f2w = watch('floor2.width') || 0
  const f2d = watch('floor2.depth') || 0

  const onSubmit = (data: FormData) => {
    setBuildingInfo({
      floorAreas: {
        floor1: data.floor1.width * data.floor1.depth,
        floor2:
          floors >= 2 && data.floor2
            ? data.floor2.width * data.floor2.depth
            : undefined,
      },
      floorShapes: {
        floor1: {
          width: data.floor1.width * 1000,
          depth: data.floor1.depth * 1000,
          isRegular: true,
        },
        floor2:
          floors >= 2 && data.floor2
            ? {
                width: data.floor2.width * 1000,
                depth: data.floor2.depth * 1000,
                isRegular: true,
              }
            : undefined,
      },
    })
    nextStep()
    router.push('/detailed/wall-spec')
  }

  const handleBack = () => {
    prevStep()
    router.push('/detailed/building-info')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1階 平面寸法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>X方向（間口）(m)</Label>
              <Input type="number" step="0.1" {...register('floor1.width', { valueAsNumber: true })} />
              {errors.floor1?.width && (
                <p className="text-xs text-red-500">
                  {errors.floor1.width.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Y方向（奥行）(m)</Label>
              <Input type="number" step="0.1" {...register('floor1.depth', { valueAsNumber: true })} />
              {errors.floor1?.depth && (
                <p className="text-xs text-red-500">
                  {errors.floor1.depth.message}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            床面積: {(f1w * f1d).toFixed(1)} m²
          </p>
          {/* 簡易プレビュー */}
          <div className="border rounded p-4 bg-zinc-50 flex items-center justify-center">
            <div
              className="border-2 border-zinc-400 bg-white"
              style={{
                width: Math.min(200, f1w * 15),
                height: Math.min(150, f1d * 15),
              }}
            >
              <div className="flex items-center justify-center h-full text-xs text-zinc-400">
                {f1w}m × {f1d}m
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {floors >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2階 平面寸法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X方向（間口）(m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register('floor2.width', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Y方向（奥行）(m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register('floor2.depth', { valueAsNumber: true })}
                />
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              床面積: {(f2w * f2d).toFixed(1)} m²
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={handleBack}>
          戻る
        </Button>
        <Button type="submit">次へ：壁仕様入力</Button>
      </div>
    </form>
  )
}
