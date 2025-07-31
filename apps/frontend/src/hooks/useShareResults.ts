import { useQuizStore } from '@/stores/quiz-store'

/**
 * Hook para compartilhamento de resultados do quiz
 * Oferece múltiplas opções: PDF, texto, link
 */
export function useShareResults() {
  const { userName, questions, answers, getScore } = useQuizStore()
  const { correct, total } = getScore()

  const generateResultsText = () => {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    
    let text = `🎓 Quiz Results - ${userName}\n\n`
    text += `📊 Score: ${correct}/${total} (${percentage}%)\n\n`
    text += `📝 Question Breakdown:\n`
    
    questions.forEach((question, index) => {
      const answer = answers.find(a => a.questionId === question.id)
      if (answer) {
        const status = answer.isCorrect ? '✅' : '❌'
        text += `\n${index + 1}. ${question.question}\n`
        text += `${status} Your answer: ${answer.userAnswer}\n`
        if (!answer.isCorrect) {
          text += `✅ Correct answer: ${answer.correctAnswer}\n`
        }
      }
    })
    
    text += `\n\n🚀 Generated with Unstuck Quiz Generator`
    return text
  }

  const shareAsText = async () => {
    const text = generateResultsText()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s Quiz Results`,
          text: text
        })
      } catch {
        console.log('Native sharing not available, falling back to clipboard')
        await navigator.clipboard.writeText(text)
        return { success: true, method: 'clipboard' }
      }
      return { success: true, method: 'native' }
    } else {
      await navigator.clipboard.writeText(text)
      return { success: true, method: 'clipboard' }
    }
  }

  const downloadAsPDF = () => {
    // Para implementação completa, usaríamos jsPDF ou similar
    // Por ora, vamos baixar como arquivo de texto
    const text = generateResultsText()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${userName.replace(/\s+/g, '_')}_Quiz_Results.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return { success: true, method: 'download' }
  }

  const copyToClipboard = async () => {
    const text = generateResultsText()
    await navigator.clipboard.writeText(text)
    return { success: true, method: 'clipboard' }
  }

  return {
    shareAsText,
    downloadAsPDF,
    copyToClipboard,
    generateResultsText,
  }
}