export function CustomError({ children }: {children: JSX.Element | string}): JSX.Element {
  return <div className='error'>
    {children}
</div>
}
