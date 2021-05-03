import Link from 'next/link'

const Navbar =  ({ currentUser }) => {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Create Event', href: '/events/new' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }

    ]
    .filter(linkConfig => linkConfig) // *filter out all non false value
    .map(({ label, href }) => {
        return <li key={href} className="nav-item">
            <Link href={href}>
                <a className="nav-link">{label}</a>
            </Link>
        </li>
    })


    return <nav className="navbar navbar-light" style={{"backgroundColor": "#e3f2fd"}}>
        <Link href="/">
            <a className="navbar-brand">Eventure</a>
        </Link>

        <div className="d-flex justify-content-end">
           <ul className="nav d-flex align-items-center">
             {links}  
           </ul>      
        </div>
    </nav>
}

export default Navbar;