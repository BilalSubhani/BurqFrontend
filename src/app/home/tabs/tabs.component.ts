import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less']
})
export class TabsComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    const tabs = Array.from(this.document.querySelectorAll('.tab')) as HTMLElement[];
    const images = Array.from(this.document.querySelectorAll('.content img')) as HTMLElement[];
    const icons = Array.from(this.document.querySelectorAll('.icon')) as HTMLElement[];

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        icons.forEach(icon => icon.classList.remove('active'));

        tab.classList.add('active');

        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
          const imageToActivate = this.document.querySelector(`.content img[data-tab="${tabId}"]`);
          const iconToActivate = this.document.querySelector(`.icon[data-tab="${tabId}"]`);

          if (imageToActivate) {
            imageToActivate.classList.add('active');
          }

          if (iconToActivate) {
            iconToActivate.classList.add('active');
          }
        }
      });
    });
  }
}
