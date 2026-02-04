'use client'

import type { SimpleQuestion } from '@/types/simple-diagnosis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface QuestionCardProps {
  question: SimpleQuestion
  selectedOptionId?: string
  onSelect: (optionId: string) => void
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          問{question.id}. {question.questionJa}
        </CardTitle>
        {question.helpTextJa && (
          <p className="text-sm text-zinc-500 mt-1">{question.helpTextJa}</p>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOptionId ?? ''} onValueChange={onSelect}>
          {question.options.map((option) => (
            <div
              key={option.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-zinc-50 cursor-pointer"
            >
              <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
              <Label htmlFor={option.id} className="cursor-pointer flex-1">
                <span className="font-medium">{option.labelJa}</span>
                {option.descriptionJa && (
                  <span className="block text-sm text-zinc-500 mt-0.5">
                    {option.descriptionJa}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
