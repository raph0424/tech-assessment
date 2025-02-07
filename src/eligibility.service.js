class EligibilityService {
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    for (const key in criteria) {
      if (!this.checkCondition(cart, key, criteria[key])) {
        return false; // Si une des conditions return false le panier n'est plus éligible
      }
    }
    return true;
  }

  checkCondition(cart, key, condition) {
    const value = this.getValue(cart, key);
    
    if (typeof condition !== 'object') {
      return value == condition;
    }
    
    if ('gt' in condition) return value > condition.gt;
    if ('lt' in condition) return value < condition.lt;
    if ('gte' in condition) return value >= condition.gte;
    if ('lte' in condition) return value <= condition.lte;
    
    if ('in' in condition) {
      return Array.isArray(value) 
        ? value.some(v => condition.in.includes(v)) 
        : condition.in.includes(value);
    }
    

    // Conditions Récursives 

    if ('and' in condition) {
      return Object.keys(condition.and).every(subKey => 
        this.checkCondition(cart, key, { [subKey]: condition.and[subKey] })
      );
    }

    if ('or' in condition) {
      return Object.keys(condition.or).some(subKey => 
        this.checkCondition(cart, key, { [subKey]: condition.and[subKey] })
      );
    }
    
    return false; // Condition inconnue
  }

  getValue(cart, key) {
    const keys = key.split('.');
    let value = cart;
    
    for (const k of keys) {
      if (Array.isArray(value)) {
        value = value.map(item => item[k]);
      } else {
        value = value[k];
      }
    }
    
    return value;
  }
}

module.exports = {
  EligibilityService,
};
