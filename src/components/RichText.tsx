import React from 'react'

type Node = any

function renderChildren(children: Node[] = []): React.ReactNode {
  return children.map((child, i) => <Fragment key={i} node={child} />)
}

function Fragment({ node }: { node: Node }) {
  if (!node) return null

  // Text node
  if (node.type === 'text' || typeof node.text === 'string') {
    let text: React.ReactNode = node.text ?? ''
    const format = node.format
    if (typeof format === 'number') {
      if (format & 1) text = <strong>{text}</strong>
      if (format & 2) text = <em>{text}</em>
      if (format & 8) text = <u>{text}</u>
      if (format & 16) text = <code>{text}</code>
      if (format & 32) text = <s>{text}</s>
    }
    return <>{text}</>
  }

  switch (node.type) {
    case 'paragraph':
      return <p>{renderChildren(node.children)}</p>
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof JSX.IntrinsicElements
      return <Tag>{renderChildren(node.children)}</Tag>
    }
    case 'quote':
      return <blockquote>{renderChildren(node.children)}</blockquote>
    case 'list': {
      const Tag = node.tag || (node.listType === 'number' ? 'ol' : 'ul')
      return <Tag>{renderChildren(node.children)}</Tag>
    }
    case 'listitem':
      return <li>{renderChildren(node.children)}</li>
    case 'link': {
      const href = node.fields?.url || node.url || '#'
      const target = node.fields?.newTab ? '_blank' : undefined
      return (
        <a href={href} target={target} rel={target ? 'noreferrer' : undefined}>
          {renderChildren(node.children)}
        </a>
      )
    }
    case 'linebreak':
      return <br />
    case 'horizontalrule':
      return <hr />
    default:
      return <>{renderChildren(node.children)}</>
  }
}

export function RichText({ data }: { data: any }) {
  const root = data?.root
  if (!root?.children?.length) return null
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-img:rounded-2xl">
      {renderChildren(root.children)}
    </div>
  )
}
