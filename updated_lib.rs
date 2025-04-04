#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

#[stylus_sdk::contract]
mod counter {
    use alloc::string::String;
    use stylus_sdk::{
        alloy_primitives::U256,
        prelude::*,
    };

    #[derive(Storage)]
    pub struct Counter {
        count: U256,
        owner: StorageAddress,
    }

    #[external]
    impl Counter {
        pub fn constructor(&mut self) -> Result<(), Vec<u8>> {
            self.owner.set(msg::sender());
            self.count.set(U256::ZERO);
            Ok(())
        }

        pub fn get_count(&self) -> Result<U256, Vec<u8>> {
            Ok(self.count.get())
        }

        pub fn increment(&mut self) -> Result<U256, Vec<u8>> {
            let new_count = self.count.get() + U256::from(1);
            self.count.set(new_count);
            Ok(new_count)
        }

        #[payable]
        pub fn deposit(&mut self) -> Result<U256, Vec<u8>> {
            Ok(msg::value())
        }
    }
}
