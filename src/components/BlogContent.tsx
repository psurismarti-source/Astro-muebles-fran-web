import { PortableText } from '@portabletext/react'

const components = {
  types: {
    image: ({ value }: any) => (
      <figure style={{ margin: '2rem 0' }}>
        <img
          src={value.asset?.url + '?w=1200&auto=format'}
          alt={value.alt ?? ''}
          style={{ width: '100%', borderRadius: '8px' }}
        />
        {value.caption && (
          <figcaption style={{ textAlign: 'center', fontSize: '0.875rem', color: '#888', marginTop: '0.5rem' }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#1a1a1a' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#1a1a1a' }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #c8a96e',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#555',
        fontSize: '1.1rem',
      }}>
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p style={{ lineHeight: 1.8, marginBottom: '1.25rem', color: '#333' }}>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#c8a96e', textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
  },
}

export default function BlogContent({ content }: { content: any[] }) {
  if (!content?.length) return null
  return (
    <div className="blog-content">
      <PortableText value={content} components={components} />
    </div>
  )
}
