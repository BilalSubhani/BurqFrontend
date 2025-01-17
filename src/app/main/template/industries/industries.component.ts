import { Component, AfterViewInit, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { ImageComponent } from '../../image/image.component';

@Component({
  selector: 'app-template-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.less'],
  imports: [CommonModule, ImageComponent]
})
export class IndustriesTemplateComponent implements AfterViewInit, OnInit {
  tabImages = {
    10: { active: '/images/tabIcons/ecommerce-blue.svg', inactive: '/images/tabIcons/ecommerce.svg' },
    11: { active: '/images/tabIcons/food-blue.svg', inactive: '/images/tabIcons/food.svg' },
    12: { active: '/images/tabIcons/flower-shop-blue.svg', inactive: '/images/tabIcons/flower-shop.svg' },
    13: { active: '/images/tabIcons/pharmacy-blue.svg', inactive: '/images/tabIcons/pharmacy.svg' },
    14: { active: '/images/tabIcons/construction-blue.svg', inactive: '/images/tabIcons/construction.svg' },
    15: { active: '/images/tabIcons/grocery-blue.svg', inactive: '/images/tabIcons/grocery.svg' },
    16: { active: '/images/tabIcons/retailer-blue.svg', inactive: '/images/tabIcons/retailer.svg' }
  };
  publicID = ['industriesContent1', 'industriesContent2', 'industriesContent3', 'industriesContent4', 'industriesContent5', 'industriesContent6', 'industriesContent7'];
  p_ID: string = 'industriesContent1';

  @Output() industryEvent = new EventEmitter<any>();
  @Input() fieldToUpdate!: string;

  private subscription?: Subscription;
  tabContentData: any;
  imagePublicUrl: string[] = ['industriesContent1', 'industriesContent2', 'industriesContent3', 'industriesContent4','industriesContent5','industriesContent6','industriesContent7'];
  imageUrl: string[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private mainService: MainService,
  ) {}
  
  imageController(){
    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          console.log(error);
        }
      );
    })
  }
  dataFunction(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>("http://localhost:3000/data/component/industries").subscribe(
        (res) => {
          this.tabContentData = res.data;
  
          observer.next();
          observer.complete();
        },
        (err) => {
          console.log('Error fetching industries data:', err);
          observer.error(err);
        }
      );
    });
  }

  ngOnInit(): void {
    const firstTab = this.document.querySelector('.ind-tab[data-tab="10"]');
    if (firstTab) {
      firstTab.classList.add('active');
    }

    const firstTabContent = this.document.querySelector('.ind-tabcontent[data-tab="10"]');
    if (firstTabContent) {
      firstTabContent.classList.add('active');
    }

    const firstTabIcon = this.document.querySelector('.ind-icon[data-tab="10"]') as HTMLImageElement;
    if (firstTabIcon) {
      firstTabIcon.src = this.tabImages[10].active;
      firstTabIcon.classList.add('active');
    }

    this.imageController();
    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });
    

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunction();
      }
    });
  }

  ngOnChanges(){
    if(this.fieldToUpdate === 'industriesContent1' || this.fieldToUpdate === 'industriesContent2' || this.fieldToUpdate === 'industriesContent3' ||
      this.fieldToUpdate === 'industriesContent4' || this.fieldToUpdate === 'industriesContent5' || this.fieldToUpdate === 'industriesContent6' || this.fieldToUpdate === 'industriesContent7'
    ){
      this.p_ID = this.fieldToUpdate;
    }
    
  }

  ngAfterViewInit(): void {
    const indTabs = Array.from(this.document.querySelectorAll('.ind-tab')) as HTMLElement[];
    const indIcons = Array.from(this.document.querySelectorAll('.ind-icon')) as HTMLImageElement[];
    const indTabContents = Array.from(this.document.querySelectorAll('.ind-tabcontent')) as HTMLElement[];

    indTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        indTabs.forEach((t) => t.classList.remove('active'));
        indTabContents.forEach((content) => content.classList.remove('active'));
        indIcons.forEach((icon) => {
          const iconTabId = icon.getAttribute('data-tab');
          if (iconTabId) {
            const numericTabId = parseInt(iconTabId, 10) as keyof typeof this.tabImages;
            if (this.tabImages[numericTabId]) {
              icon.src = this.tabImages[numericTabId].inactive;
              icon.classList.remove('active');
            }
          }
        });

        const indTabId = tab.getAttribute('data-tab');
        if (indTabId) {
          const numericTabId = parseInt(indTabId, 10) as keyof typeof this.tabImages;

          tab.classList.add('active');
          const activeContent = this.document.querySelector(`.ind-tabcontent[data-tab="${indTabId}"]`);
          if (activeContent) {
            activeContent.classList.add('active');
          }

          const activeIcon = this.document.querySelector(`.ind-icon[data-tab="${indTabId}"]`) as HTMLImageElement;
          if (activeIcon) {
            activeIcon.src = this.tabImages[numericTabId].active;
            activeIcon.classList.add('active');
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  setExport(){
    this.industryEvent.emit(this.tabContentData);
  }
}