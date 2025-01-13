import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Components
import { ProviderComponent } from './provider/provider.component';
import { TabsComponent } from './tabs/tabs.component';
import { IntegrateComponent } from './integrate/integrate.component';
import { IndustriesComponent } from './industries/industries.component';
import { WhyburqComponent } from './whyburq/whyburq.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FooterComponent } from './footer/footer.component';
import { BackingComponent } from './backing/backing.component';

import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MainService } from '../main.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProviderComponent, TabsComponent, IntegrateComponent, IndustriesComponent, WhyburqComponent, TestimonialsComponent, FooterComponent, BackingComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar', { static: false }) navbar!: ElementRef;
  @ViewChild('featuresHeading', { static: false }) cards!: ElementRef;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('featuresContainer', { static: false }) featureSection!: ElementRef;
  @ViewChild('feature1Card', { static: false }) feature1!: ElementRef;
  @ViewChild('feature2Card', { static: false }) feature2!: ElementRef;
  @ViewChild('feature3Card', { static: false }) feature3!: ElementRef;
  @ViewChild('myBtn', { static: false }) myBtn!: ElementRef;
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

  private socket: any;
  messageReceived:string = '';

  imagePublicUrl: string[] = ['burq-logo', 'lines', 'featureTile1', 'featureTile2', 'featureTile3'];
  imageUrl: string[] = [];

  videoUrl: string = '';
  public_id: string = '3steps';

  navbarData: any;
  heroSectionData: any;
  featuresData: any;

  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Side Navbar

  dropdownSections = [
    { 
      name: 'Navbar', 
      comp: 'navbar',
    },
    { 
      name: 'Hero', 
      comp: 'heroSection',
    },
    { 
      name: 'Features', 
      comp: 'featuresContainer',
    },
    { 
      name: 'Provider',
      comp: 'provider', 
    },
    { 
      name: 'Tab', 
      comp: 'tabs',
    },
    { 
      name: 'Integrate', 
      comp: 'integrate',

    },
    { 
      name: 'Industries', 
      comp: 'industries',
    },
    { 
      name: 'Why Burq?', 
      comp: 'whyBurq'
    },
    { 
      name: 'Selling Points', 
      comp: 'whyBurq',
    },
    { 
      name: 'Testimonials', 
      comp: 'testimonials',
    },
    { 
      name: 'Backing', 
      comp: 'backing',
    },
    { 
      name: 'Powering', 
      comp: 'backing',
    },
    {
      name: 'Footer', 
      comp: 'footer',
    }
  ];

  openNav() {
    this.mySidenav.nativeElement.style.width = '250px';
  }
  closeNav() {
    this.mySidenav.nativeElement.style.width = '0';
  }

  scrollTo(componentId: any) {
    this.closeNav();
    const childElement = document.getElementById(componentId);
     
    if (childElement) {
      childElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else
      this.topFunction();
  }

  dataController(): void{
    this.http.get<any>(`http://localhost:3000/media/videos/${this.public_id}`).subscribe(
      (response: any) => {
        this.videoUrl = response.url;
      },
      (error) => {
        this.toastr.error('Error fetching video', 'Error', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      }
    );

    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          this.toastr.error('Error fetching video', 'Error', {
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'decreasing'
          });
        }
      );
    })

    this.http.get<any>('http://localhost:3000/data/component/navbar').subscribe(
      (res: any)=>{
        this.navbarData={...this.navbarData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );

    this.http.get<any>('http://localhost:3000/data/component/heroSection').subscribe(
      (res: any)=>{
        this.heroSectionData= {...this.heroSectionData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );

    this.http.get<any>('http://localhost:3000/data/component/features').subscribe(
      (res: any)=>{
        this.featuresData=res.data;
      }, (err) =>{
      }
    );
    
    this.mainService.notifyDataChange(false);
  }


  ngOnInit() {
    this.dataController();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
    });
  }

  connectToSocket(): void {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      // console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('handleChange', (data: any) => {
      // console.log('Message received from server:', data);
      this.messageReceived = data;
      this.implementation();
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });
  }

  implementation(){
      window.location.reload();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        const observerNavbar = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.navbar.nativeElement, 'expand');
            
            const scrolled = entry.isIntersecting ? 'None' : 'Block';
            this.renderer.setStyle(this.myBtn.nativeElement, 'display', scrolled);
          });
        }, { threshold: 0.7 });

        const observerCards = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.cards.nativeElement, 'show');
          });
        }, { threshold: 0.2 });

        const observerFeatures = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.feature1.nativeElement, 'show');
            this.renderer[action](this.feature2.nativeElement, 'show');
            this.renderer[action](this.feature3.nativeElement, 'show');
          });
        }, { threshold: 0.5 });

        observerNavbar.observe(this.heroSection.nativeElement);
        observerCards.observe(this.featureSection.nativeElement);
        observerFeatures.observe(this.featureSection.nativeElement);
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  topFunction(): void {
    const scrollStep = -window.scrollY / (2000 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
