import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { visualizers } from '@/lib/data'
import VisualizerList from '@/components/visualizer-list'

// Mock next/link to simplify testing hrefs
jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href} data-mock-link>{children}</a>
})

// Mock next/image to render a basic img tag
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} />
})

function Wrapper() {
  const sortInitial = visualizers.filter(v => v.section === 'sort').slice(0, 8)
  const searchInitial = visualizers.filter(v => v.section === 'search').slice(0, 8)
  const audioInitial = visualizers.filter(v => v.section === 'audio').slice(0, 8)
  return (
    <div>
      <VisualizerList initialVisualizers={sortInitial} section="sort" />
      <VisualizerList initialVisualizers={searchInitial} section="search" />
      <VisualizerList initialVisualizers={audioInitial} section="audio" />
    </div>
  )
}

describe('Visualizer links', () => {
  test('all visualizer cards render with correct hrefs', () => {
    render(<Wrapper />)
    for (const v of visualizers) {
      const titleEl = screen.getByText(v.title)
      expect(titleEl).toBeInTheDocument()
      const anchor = titleEl.closest('a')
      expect(anchor).not.toBeNull()
      expect(anchor).toHaveAttribute('href', expect.stringContaining(v.href))
    }
  })
})
