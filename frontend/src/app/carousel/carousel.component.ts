import { Component, ViewChildren, QueryList, Input, ElementRef } from '@angular/core';
import { CarouselItemDirective,  } from './carousel-item.directive';
import { CarouselItemElementDirective } from './carousel-item-element.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @ViewChildren(CarouselItemDirective)
  items!: QueryList<CarouselItemDirective>;

  @ViewChildren(CarouselItemElementDirective, { read: ElementRef })
  private itemsElements!: QueryList<ElementRef>;

  @Input() timing = '250ms ease-in';
  showControls = true;
  private player!: AnimationPlayer;
  private itemWidth!: number;
  private currentSlide = 0;

  constructor(private builder: AnimationBuilder) {}

  private buildAnimation(offset: number) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` })),
    ]);
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.transitionCarousel();
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.items.length) % this.items.length;
    this.transitionCarousel();
  }

  reSizeCarousel(): void {
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
  }

  transitionCarousel() {
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.itemsElements.first.nativeElement);
    this.player.play();
  }
}
