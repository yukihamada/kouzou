'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { PREFECTURE_LIST, REGION_COEFFICIENTS } from '@/lib/constants/region-coefficients'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useRouter } from 'next/navigation'

const schema = z.object({
  constructionMethod: z.enum(['conventional', '2x4']),
  buildYear: z.number().min(1900).max(2030),
  numberOfFloors: z.number().min(1).max(3),
  roofWeight: z.enum(['heavy', 'moderate', 'light']),
  foundationType: z.enum([
    'rebar_concrete_spread',
    'unreinforced_concrete',
    'rebar_concrete_mat',
    'stone',
    'other',
  ]),
  groundType: z.enum(['good', 'normal', 'soft']),
  prefecture: z.string().min(1),
  snowDepthM: z.number().min(0).max(5),
  address: z.string().max(200).optional(),
  ownerName: z.string().max(100).optional(),
})

type FormData = z.infer<typeof schema>

export function BuildingInfoForm() {
  const { buildingInfo, setBuildingInfo, nextStep } = useDetailedDiagnosisStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      constructionMethod:
        (buildingInfo.constructionMethod as 'conventional' | '2x4') ?? 'conventional',
      buildYear: buildingInfo.buildYear ?? 1990,
      numberOfFloors: buildingInfo.numberOfFloors ?? 2,
      roofWeight: (buildingInfo.roofWeight as 'heavy' | 'moderate' | 'light') ?? 'heavy',
      foundationType:
        (buildingInfo.foundationType as FormData['foundationType']) ??
        'rebar_concrete_spread',
      groundType: (buildingInfo.groundType as 'good' | 'normal' | 'soft') ?? 'normal',
      prefecture: '東京都',
      snowDepthM: buildingInfo.snowDepthM ?? 0,
      address: buildingInfo.address ?? '',
      ownerName: buildingInfo.ownerName ?? '',
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form watch() is used intentionally for conditional UI
  const buildYear = watch('buildYear')

  const onSubmit = (data: FormData) => {
    const z = REGION_COEFFICIENTS[data.prefecture] ?? 1.0
    setBuildingInfo({
      constructionMethod: data.constructionMethod,
      buildYear: data.buildYear,
      numberOfFloors: data.numberOfFloors as 1 | 2 | 3,
      roofWeight: data.roofWeight,
      foundationType: data.foundationType,
      groundType: data.groundType,
      regionCoefficientZ: z,
      snowDepthM: data.snowDepthM,
      address: data.address,
      ownerName: data.ownerName,
      diagnosisDate: new Date().toISOString().split('T')[0],
    })
    nextStep()
    router.push('/detailed/floor-plan')
  }

  const toWareki = (year: number): string => {
    if (year >= 2019) return `令和${year - 2018}年`
    if (year >= 1989) return `平成${year - 1988}年`
    if (year >= 1926) return `昭和${year - 1925}年`
    return ''
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>建物基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>構法</Label>
              <Select
                defaultValue={watch('constructionMethod')}
                onValueChange={(v) =>
                  setValue('constructionMethod', v as 'conventional' | '2x4')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conventional">
                    在来工法（木造軸組）
                  </SelectItem>
                  <SelectItem value="2x4">
                    枠組壁工法（2×4）
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>建築年（西暦）</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  {...register('buildYear', { valueAsNumber: true })}
                  className="flex-1"
                />
                <span className="text-sm text-zinc-500 whitespace-nowrap">
                  {toWareki(buildYear)}
                </span>
              </div>
              {buildYear < 1981 && (
                <p className="text-xs text-amber-600">
                  旧耐震基準（1981年以前）の建物です
                </p>
              )}
              {errors.buildYear && (
                <p className="text-xs text-red-500">{errors.buildYear.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>階数</Label>
              <Select
                defaultValue={String(watch('numberOfFloors'))}
                onValueChange={(v) =>
                  setValue('numberOfFloors', Number(v) as 1 | 2 | 3)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">平屋（1階建て）</SelectItem>
                  <SelectItem value="2">2階建て</SelectItem>
                  <SelectItem value="3">3階建て</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>屋根の重さ</Label>
              <Select
                defaultValue={watch('roofWeight')}
                onValueChange={(v) =>
                  setValue('roofWeight', v as 'heavy' | 'moderate' | 'light')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heavy">重い屋根（日本瓦等）</SelectItem>
                  <SelectItem value="moderate">
                    やや重い屋根（セメント瓦等）
                  </SelectItem>
                  <SelectItem value="light">
                    軽い屋根（金属板・スレート等）
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>基礎の種類</Label>
              <Select
                defaultValue={watch('foundationType')}
                onValueChange={(v) =>
                  setValue('foundationType', v as FormData['foundationType'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rebar_concrete_spread">
                    鉄筋コンクリート布基礎
                  </SelectItem>
                  <SelectItem value="rebar_concrete_mat">
                    鉄筋コンクリートべた基礎
                  </SelectItem>
                  <SelectItem value="unreinforced_concrete">
                    無筋コンクリート布基礎
                  </SelectItem>
                  <SelectItem value="stone">玉石基礎</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>地盤の状態</Label>
              <Select
                defaultValue={watch('groundType')}
                onValueChange={(v) =>
                  setValue('groundType', v as 'good' | 'normal' | 'soft')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">良い地盤</SelectItem>
                  <SelectItem value="normal">普通の地盤</SelectItem>
                  <SelectItem value="soft">
                    軟弱地盤（必要耐力1.5倍割増）
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>所在地（都道府県）</Label>
              <Select
                defaultValue={watch('prefecture')}
                onValueChange={(v) => setValue('prefecture', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREFECTURE_LIST.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}（Z={REGION_COEFFICIENTS[p]}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>積雪深 (m)</Label>
              <Input type="number" step="0.1" {...register('snowDepthM', { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>所有者情報（任意）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>所有者名</Label>
              <Input {...register('ownerName')} />
            </div>
            <div className="space-y-2">
              <Label>住所</Label>
              <Input {...register('address')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">次へ：平面図入力</Button>
      </div>
    </form>
  )
}
