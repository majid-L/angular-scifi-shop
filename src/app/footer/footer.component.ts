import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {
  @HostListener("window:scroll", ["event"]) onScroll() {
    if (window.scrollY > 0) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  showButton = false;

  get fill() {
    return document.body.classList.contains("light-mode") ? "#000" : "#fff";
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}