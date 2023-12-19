'use client'
import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css'
class Footer extends Component {
  render() {
    const current_year = new Date().getFullYear();
    return (
      <footer className={styles.footer}>
        <div className={`contenedor ${styles.contenido}`}>
          <nav className={styles.navegacion}>
           <Link id="link1"href="https://www.facebook.com/profile.php?id=100064930052916" target="_blank" className='btn btn-link'>
              Facebook
            </Link>
           
            <Link href="https://maps.app.goo.gl/kuQYRkmF5rf4yYqT9" target="_blank" className='btn btn-link'color='#fff'>
               Ubicanos
            
            </Link>
            
            <Link href="mailto:Roads<dave@1manstartup.com>" className='btn btn-link'>
              Habla Con Nosotros
            </Link>
          </nav>
          <p className={styles.copyright}>Todos Los Derechos Reservados</p>
        </div>
      </footer>
    )
  }
}
export default Footer;